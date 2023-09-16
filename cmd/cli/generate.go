package main

import (
	"fmt"
	"net/url"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/utils"
	"github.com/spf13/cobra"
)

var (
	ApiKey   string
	Endpoint string
)

var generateCmd = &cobra.Command{
	Use:   "generate",
	Short: "Generate JSON file from API Football response",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		var data any
		var err error
		handler := apifootball.New(ApiKey)

		switch Endpoint {
		case "fixtures":
			currentTime := time.Now()
			formattedDate := currentTime.Format("2006-01-02")
			queryParams := url.Values{}
			queryParams.Add("date", formattedDate)

			data, err = handler.GetFixtures(queryParams)
			if err != nil {
				fmt.Println(err.Error())
				return
			}
		default:
			fmt.Println("ERROR: unknown endpoint")
			return
		}

		dataStr := utils.FormatJSONResponse(data)
		filePath := "test/data/" + Endpoint + ".json"
		jsonData := []byte(dataStr)

		// Open the file for writing (create or overwrite)
		file, err := os.Create(filePath)
		if err != nil {
			fmt.Println("Error creating file:", err)
			return
		}
		defer file.Close()

		_, err = file.Write(jsonData)
		if err != nil {
			fmt.Println("Error writing to file:", err)
			return
		}

		fmt.Println("JSON data has been written to", filePath)
	},
}

func init() {
	godotenv.Load()

	generateCmd.Flags().StringVarP(&Endpoint, "endpoint", "e", "", "API Football endpoint to fetch data from")
	generateCmd.MarkFlagRequired("endpoint")

	foundApiKey := os.Getenv("API_FOOTBALL_KEY")
	generateCmd.Flags().StringVarP(&ApiKey, "apikey", "a", foundApiKey, "API Football api key (if in root dir, will use .env)")
	if foundApiKey == "" {
		generateCmd.MarkFlagRequired("apikey")
	}
}
