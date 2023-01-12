require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

$RNMBGL = Object.new

def $RNMBGL._add_spm_to_target(project, target, url, requirement, product_name)
  pkg_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference
  ref_class = Xcodeproj::Project::Object::XCSwiftPackageProductDependency
  pkg = project.root_object.package_references.find { |p| p.class == pkg_class && p.repositoryURL == url }
  if !pkg
    pkg = project.new(pkg_class)
    pkg.repositoryURL = url
    pkg.requirement = requirement
    project.root_object.package_references << pkg
  end
  ref = target.package_product_dependencies.find { |r| r.class == ref_class && r.package == pkg && r.product_name == product_name }
  if !ref
    ref = project.new(ref_class)
    ref.package = pkg
    ref.product_name = product_name
    target.package_product_dependencies << ref
  end
end

def $RNMBGL.post_install(installer)
  spm_spec = {
    url: "https://github.com/maplibre/maplibre-gl-native-distribution",
    requirement: {
      kind: "exactVersion",
      version: "5.13.0"
    },
    product_name: "Mapbox"
  }

  if $RNMBGL_SPM_Spec.is_a?(Hash)
    spm_spec = $RNMBGL_SPM_Spec
  end
  project = installer.pods_project
  self._add_spm_to_target(
    project,
    project.targets.find { |t| t.name == "maplibre-react-native"},
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
      end
    end
  end
end

Pod::Spec.new do |s|
  s.name		= "maplibre-react-native"
  s.summary		= "React Native Component for Maplibre Native"
  s.version		= package['version']
  s.authors		= { "Ian Wagner" => "ian.wagner@stadiamaps.com" }  # TODO: MapLibre email?
  s.homepage    	= "https://github.com/maplibre/maplibre-react-native"
  s.source      	= { :git => "https://github.com/maplibre/maplibre-react-native.git" }
  s.license     	= "MIT"
  s.platform    	= :ios, "8.0"

  s.dependency 'React-Core'
  s.dependency 'React'

  s.subspec 'DynamicLibrary' do |sp|
    sp.source_files	= "ios/RCTMGL/**/*.{h,m}"
  end
end
