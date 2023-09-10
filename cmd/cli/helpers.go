package main

import "encoding/json"

func formatJSONResponse[T comparable](inputMap T) string {
	jsonData, err := json.MarshalIndent(inputMap, "", "    ")
	if err != nil {
		return err.Error()
	}

	return string(jsonData)
}
