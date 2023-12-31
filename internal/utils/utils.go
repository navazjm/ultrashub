package utils

import (
	"encoding/json"
	"io"
	"os"
)

func FormatJSONResponse[T comparable](inputMap T) string {
	jsonData, err := json.MarshalIndent(inputMap, "", "    ")
	if err != nil {
		return err.Error()
	}

	return string(jsonData)
}

func ReadFile(filePath string) ([]byte, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Read the file content into a byte slice
	fileContent, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	return fileContent, nil
}
