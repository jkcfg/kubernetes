#!/bin/bash -e
go run ./cmd/apigen cmd/apigen/specs/swagger-v1.13.0.json cmd/apigen/templates ./src/
