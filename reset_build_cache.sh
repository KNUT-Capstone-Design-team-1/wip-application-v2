#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
platform=$1

echo "Reset build cache"

case $platform in
  android)
    pushd $SCRIPT_DIR/android
    ./gradlew clean
    rm -rf .gradle \
    build \
    app/build
    popd
    ;;

  ios)
    pushd $SCRIPT_DIR/ios
    xattr -w com.apple.xcode.CreatedByBuildSystem true $SCRIPT_DIR/ios/build
    xcodebuild clean
    rm -rf build \
    ~/Library/Developer/Xcode/DerivedData
    popd
    ;;

  *)
    echo "Invalid platform '$platform'. platform must be 'ios' or 'android'"
    exit 0
    ;;
esac

rm -rf $TMPDIR/metro-cache\
  $TMPDIR/react-*
