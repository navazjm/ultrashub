package apifootball

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/julienschmidt/httprouter"

	"github.com/navazjm/ultrashub/internal/utils"
)

type ErrorMessageResponse struct {
	Message string `json:"message"`
}

func (afs *Service) ProxyHandler(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	path := params.ByName("path")
	queryParams := r.URL.Query()
	apiURL, err := url.Parse(afs.ApiBaseURL)
	if err != nil {
		utils.ServerErrorResponse(afs.Logger, w, r, err)
		return
	}
	apiURL.Path = path
	apiURL.RawQuery = queryParams.Encode()

	client := &http.Client{}

	req, err := http.NewRequest("GET", apiURL.String(), nil)
	if err != nil {
		utils.BadRequestResponse(afs.Logger, w, r, err)
		return
	}

	req.Header.Set("x-rapidapi-host", afs.ApiHost)
	req.Header.Set("x-rapidapi-key", afs.ApiKey)

	response, err := client.Do(req)
	if err != nil {
		utils.ErrorResponse(afs.Logger, w, r, http.StatusBadRequest, fmt.Sprintf("Error fetching data from API Football: %s", err))
		return
	}
	defer response.Body.Close()

	switch response.StatusCode {
	// API-Football only returns status codes of 499 & 500 for bad responses
	// status code 499 -> Time out error not in http package
	case http.StatusInternalServerError, 499:
		var errMsgResp ErrorMessageResponse
		err = json.NewDecoder(response.Body).Decode(&errMsgResp)
		if err != nil {
			utils.BadRequestResponse(afs.Logger, w, r, err)
			return
		}
		err = errors.New("APIFootball: " + errMsgResp.Message)
		utils.BadRequestResponse(afs.Logger, w, r, err)
	case http.StatusNoContent:
		err = errors.New("API Football: report bug")
		utils.BadRequestResponse(afs.Logger, w, r, err)
	case http.StatusOK:
		var responseData utils.Envelope
		err = json.NewDecoder(response.Body).Decode(&responseData)
		if err != nil {
			utils.ServerErrorResponse(afs.Logger, w, r, err)
			return
		}
		err = utils.WriteJSON(w, http.StatusOK, responseData, nil)
		if err != nil {
			utils.ServerErrorResponse(afs.Logger, w, r, err)
		}
	default:
		err := errors.New("APIFootball: Unexpected http status code")
		utils.ServerErrorResponse(afs.Logger, w, r, err)
	}
}