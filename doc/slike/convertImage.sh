#!/bin/bash

# This tool converts input svg image to pdf in the same directory

INPUT=$1
dir=$(dirname $1)

OUT_NAME="$(basename $INPUT .svg).pdf"
FINAL_NAME="$dir/$OUT_NAME"

inkscape $INPUT --export-pdf=$FINAL_NAME
