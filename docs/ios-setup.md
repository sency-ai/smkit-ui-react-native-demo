# iOS Setup

1. Update *Podfile* in `iOS` folder:
```
[1] add the source to the top of your Podfile.
source 'https://bitbucket.org/sency-ios/sency_ios_sdk.git'
source 'https://github.com/CocoaPods/Specs.git'

[2] add use_frameworks! commend to your target
target 'YOUR_TARGET' do
  use_frameworks!
  
[3] At the end of your code please add 

  post_install do |installer|
   react_native_post_install(
     installer,
     :mac_catalyst_enabled => false
   )
   installer.pods_project.targets.each do |target|
     target.build_configurations.each do |config|
       config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
       config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
     end
   end
   __apply_Xcode_12_5_M1_post_install_workaround(installer)
 end
end

```

2. Run `NO_FLIPPER=1 pod install` to install the necessary pods.
3. Add camera permission request to `Info.plist`
```Xml
<key>NSCameraUsageDescription</key>
<string>Camera access is needed</string>
```

----- 
## Known issues
1. Dynamic/Static linking issues due to `use_frameworks`:
