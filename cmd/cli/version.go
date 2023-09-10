package main

import (
	"fmt"

	"github.com/spf13/cobra"
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of UltrasHub CLI",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("v0.1.0 -- HEAD")
	},
}
