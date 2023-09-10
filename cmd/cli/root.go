package main

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "ultrashub",
	Short: "Generate json files",
	Long:  ``,
}

func init() {
	rootCmd.AddCommand(generateCmd)
	rootCmd.AddCommand(versionCmd)
}
