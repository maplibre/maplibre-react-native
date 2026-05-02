require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Global Variable Defaults
$MLRN_NATIVE_VERSION ||= "6.25.0"
$MLRN_SPM_SPEC ||= {
  url: "https://github.com/maplibre/maplibre-gl-native-distribution",
  requirement: {
    kind: "exactVersion",
    version: $MLRN_NATIVE_VERSION
  },
  product_name: "MapLibre"
}

$MLRN = Object.new

def $MLRN._add_spm_to_target(project, target, url, requirement, product_name)
  pkg_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference
  ref_class = Xcodeproj::Project::Object::XCSwiftPackageProductDependency
  pkg = project.root_object.package_references.find { |p| p.class == pkg_class && p.repositoryURL == url }
  if !pkg
    pkg = project.new(pkg_class)
    pkg.repositoryURL = url
    project.root_object.package_references << pkg
  end
  pkg.requirement = requirement
  ref = target.package_product_dependencies.find { |r| r.class == ref_class && r.package == pkg && r.product_name == product_name }
  if !ref
    ref = project.new(ref_class)
    ref.package = pkg
    ref.product_name = product_name
    target.package_product_dependencies << ref
  end
end

def $MLRN.post_install(installer)
  spm_spec = $MLRN_SPM_SPEC

  project = installer.pods_project
  mlrn_target = project.targets.find { |t| t.name == "MapLibreReactNative" }
  self._add_spm_to_target(
    project,
    mlrn_target,
    spm_spec[:url],
    spm_spec[:requirement],
    spm_spec[:product_name]
  )

  installer.aggregate_targets.group_by(&:user_project).each do |project, targets|
    targets.each do |target|
      target.user_targets.each do |user_target|
        self._add_spm_to_target(
          project,
          user_target,
          spm_spec[:url],
          spm_spec[:requirement],
          spm_spec[:product_name]
        )

        phase_name = "[MapLibre React Native] Remove MapLibre.xcframework-ios.signature"
        unless user_target.shell_script_build_phases.any? { |p| p.name == phase_name }
          phase = user_target.new_shell_script_build_phase(phase_name)
          phase.shell_script = 'rm -rf "$CONFIGURATION_BUILD_DIR/MapLibre.xcframework-ios.signature"'
          phase.always_out_of_date = "1"
        end
      end
    end
  end
end

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

 install_modules_dependencies(s)
end
