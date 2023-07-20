import {isAndroid} from './utils';
import MapView from './components/MapView';
import Light from './components/Light';
import PointAnnotation from './components/PointAnnotation';
import Annotation from './components/annotations/Annotation';
import Callout from './components/Callout';
import UserLocation from './components/UserLocation';
import Camera from './components/Camera';
import VectorSource from './components/VectorSource';
import ShapeSource from './components/ShapeSource';
import RasterSource from './components/RasterSource';
import ImageSource from './components/ImageSource';
import Images from './components/Images';
import FillLayer from './components/FillLayer';
import FillExtrusionLayer from './components/FillExtrusionLayer';
import HeatmapLayer from './components/HeatmapLayer';
import LineLayer from './components/LineLayer';
import CircleLayer from './components/CircleLayer';
import SymbolLayer from './components/SymbolLayer';
import RasterLayer from './components/RasterLayer';
import BackgroundLayer from './components/BackgroundLayer';
import locationManager from './modules/location/locationManager';
import offlineManager from './modules/offline/offlineManager';
import snapshotManager from './modules/snapshot/snapshotManager';
import MarkerView from './components/MarkerView';
import Animated from './utils/animated/Animated';
import AnimatedMapPoint from './utils/animated/AnimatedPoint';
import AnimatedShape from './utils/animated/AnimatedShape';
import AnimatedCoordinatesArray from './utils/animated/AnimatedCoordinatesArray';
import AnimatedExtractCoordinateFromArray from './utils/animated/AnimatedExtractCoordinateFromArray';
import AnimatedRouteCoordinatesArray from './utils/animated/AnimatedRouteCoordinatesArray';
import Style from './components/Style';
import Logger from './utils/Logger';

import {NativeModules, PermissionsAndroid} from 'react-native';

const MapLibreGL = {...NativeModules.MGLModule};

// static methods
MapLibreGL.requestAndroidLocationPermissions = async function () {
  if (isAndroid()) {
    const res = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    if (!res) {
      return false;
    }

    const permissions = Object.keys(res);
    for (const permission of permissions) {
      if (res[permission] === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
    }

    return false;
  }

  throw new Error('You should only call this method on Android!');
};

MapLibreGL.UserTrackingModes = Camera.UserTrackingModes;

// components
MapLibreGL.MapView = MapView;
MapLibreGL.Light = Light;
MapLibreGL.PointAnnotation = PointAnnotation;
MapLibreGL.Callout = Callout;
MapLibreGL.UserLocation = UserLocation;
MapLibreGL.Camera = Camera;
MapLibreGL.Style = Style;

// annotations
MapLibreGL.Annotation = Annotation;
MapLibreGL.MarkerView = MarkerView;

// sources
MapLibreGL.VectorSource = VectorSource;
MapLibreGL.ShapeSource = ShapeSource;
MapLibreGL.RasterSource = RasterSource;
MapLibreGL.ImageSource = ImageSource;
MapLibreGL.Images = Images;

// layers
MapLibreGL.FillLayer = FillLayer;
MapLibreGL.FillExtrusionLayer = FillExtrusionLayer;
MapLibreGL.HeatmapLayer = HeatmapLayer;
MapLibreGL.LineLayer = LineLayer;
MapLibreGL.CircleLayer = CircleLayer;
MapLibreGL.SymbolLayer = SymbolLayer;
MapLibreGL.RasterLayer = RasterLayer;
MapLibreGL.BackgroundLayer = BackgroundLayer;

// modules
MapLibreGL.locationManager = locationManager;
MapLibreGL.offlineManager = offlineManager;
MapLibreGL.snapshotManager = snapshotManager;

// animated
MapLibreGL.Animated = Animated;

// utils
MapLibreGL.AnimatedPoint = AnimatedMapPoint;
MapLibreGL.AnimatedCoordinatesArray = AnimatedCoordinatesArray;
MapLibreGL.AnimatedExtractCoordinateFromArray =
  AnimatedExtractCoordinateFromArray;
MapLibreGL.AnimatedRouteCoordinatesArray = AnimatedRouteCoordinatesArray;
MapLibreGL.AnimatedShape = AnimatedShape;
MapLibreGL.Logger = Logger;

const {LineJoin} = MapLibreGL;

export {
  MapView,
  Light,
  PointAnnotation,
  Callout,
  UserLocation,
  Camera,
  Annotation,
  MarkerView,
  VectorSource,
  ShapeSource,
  RasterSource,
  ImageSource,
  Images,
  FillLayer,
  FillExtrusionLayer,
  HeatmapLayer,
  LineLayer,
  CircleLayer,
  SymbolLayer,
  RasterLayer,
  BackgroundLayer,
  locationManager,
  offlineManager,
  snapshotManager,
  AnimatedMapPoint,
  AnimatedCoordinatesArray,
  AnimatedShape,
  Animated,
  LineJoin,
  Logger,
  Style,
};

export default MapLibreGL;
