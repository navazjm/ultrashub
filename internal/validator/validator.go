package validator

import (
	"regexp"
	"slices"
	"strings"
	"unicode/utf8"
)

// Define a new Validator type which contains a map of validation errors.
type Validator struct {
	Errors map[string]string
}

// New is a helper which creates a new Validator instance with an empty errors map.
func New() *Validator {
	return &Validator{Errors: make(map[string]string)}
}

// Valid returns true if the errors map doesn't contain any entries.
func (v *Validator) Valid() bool {
	return len(v.Errors) == 0
}

// AddError adds an error message to the map (so long as no entry already exists for
// the given key).
func (v *Validator) AddError(key, message string) {
	if _, exists := v.Errors[key]; !exists {
		v.Errors[key] = message
	}
}

// Check adds an error message to the map only if a validation check is not 'ok'.
func (v *Validator) Check(ok bool, key, message string) {
	if !ok {
		v.AddError(key, message)
	}
}

// Generic function which returns true if a specific value is in a list of permitted
// values.
func PermittedValue[T comparable](value T, permittedValues ...T) bool {
	return slices.Contains(permittedValues, value)
}

// Matches returns true if a string value matches a specific regexp pattern.
func Matches(value string, rx *regexp.Regexp) bool {
	return rx.MatchString(value)
}

// Generic function which returns true if all values in a slice are unique.
func IsUnique[T comparable](values []T) bool {
	uniqueValues := make(map[T]bool)

	for _, value := range values {
		uniqueValues[value] = true
	}

	return len(values) == len(uniqueValues)
}

// Returns true if the value is not blank
func IsNotBlank(value string) bool {
	return strings.TrimSpace(value) != ""
}

// IsWithinCharLimit returns true if the given string does not exceed the specified character limit n.
func IsWithinCharLimit(value string, n int) bool {
	return utf8.RuneCountInString(value) <= n
}

// IsSliceSizeWithinLimit returns true if the length of the slice does not exceed the specified limit n.
func IsSliceSizeWithinLimit[T comparable](values []T, n int) bool {
	return len(values) <= n
}
