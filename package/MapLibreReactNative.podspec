require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Global Variable Defaults
$MLRN_NATIVE_VERSION ||= "6.26.0"
$MLRN_SPM_SPEC ||= {
  url: "https://github.com/maplibre/maplibre-gl-native-distribution",
  requirement: {
    kind: "exactVersion",
    version: $MLRN_NATIVE_VERSION
  },
  products: "MapLibre"
}

Pod::Spec.new do |s|
  s.name         = "MapLibreReactNative"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/maplibre/maplibre-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp}"
  s.private_header_files = "ios/**/*.h"

  spm_dependency(s,
    url: $MLRN_SPM_SPEC[:url],
    requirement: $MLRN_SPM_SPEC[:requirement],
    products: [$MLRN_SPM_SPEC[:products]]
  )

  install_modules_dependencies(s)
end
