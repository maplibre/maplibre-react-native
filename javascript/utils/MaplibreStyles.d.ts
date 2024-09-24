/* This file was generated from MapboxStyle.ts.ejs do not modify */
import { type ImageSourcePropType } from "react-native";

export type Translation = { x: number; y: number } | [number, number];

export interface Transition {
  duration: number;
  delay: number;
}

export type FormattedString = string; /* TODO */

type ExpressionName =
  // Types
  | "array"
  | "boolean"
  | "collator"
  | "format"
  | "image"
  | "literal"
  | "number"
  | "number-format"
  | "object"
  | "string"
  | "to-boolean"
  | "to-color"
  | "to-number"
  | "to-string"
  | "typeof"
  // Feature data
  | "accumulated"
  | "feature-state"
  | "geometry-type"
  | "id"
  | "line-progress"
  | "properties"
  // Lookup
  | "at"
  | "get"
  | "has"
  | "in"
  | "index-of"
  | "length"
  | "slice"
  // Decision
  | "!"
  | "!="
  | "<"
  | "<="
  | "=="
  | ">"
  | ">="
  | "all"
  | "any"
  | "case"
  | "match"
  | "coalesce"
  | "within"
  // Ramps, scales, curves
  | "interpolate"
  | "interpolate-hcl"
  | "interpolate-lab"
  | "step"
  // Variable binding
  | "let"
  | "var"
  // String
  | "concat"
  | "downcase"
  | "is-supported-script"
  | "resolved-locale"
  | "upcase"
  // Color
  | "rgb"
  | "rgba"
  | "to-rgba"
  // Math
  | "-"
  | "*"
  | "/"
  | "%"
  | "^"
  | "+"
  | "abs"
  | "acos"
  | "asin"
  | "atan"
  | "ceil"
  | "cos"
  | "distance"
  | "e"
  | "floor"
  | "ln"
  | "ln2"
  | "log10"
  | "log2"
  | "max"
  | "min"
  | "pi"
  | "round"
  | "sin"
  | "sqrt"
  | "tan"
  // Zoom, Heatmap
  | "zoom"
  | "heatmap-density";

type ExpressionField =
  | string
  | number
  | boolean
  | Expression
  | ExpressionField[]
  | { [key: string]: ExpressionField };

export type Expression = readonly [ExpressionName, ...ExpressionField[]];

export type FilterExpression = Expression;

type ExpressionParameters =
  | "zoom"
  | "feature"
  | "feature-state"
  | "sky-radial-progress"
  | "line-progress"
  | "heatmap-density";

type ResolvedImageType = ImageSourcePropType | string;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Value<T, AllowedParameters extends ExpressionParameters[] = []> =
  | T
  | Expression;

export enum VisibilityEnum {
  /** The layer is shown. */
  Visible = "visible",
  /** The layer is not shown. */
  None = "none",
}
type VisibilityEnumValues = "visible" | "none";
export enum FillTranslateAnchorEnum {
  /** The fill is translated relative to the map. */
  Map = "map",
  /** The fill is translated relative to the viewport. */
  Viewport = "viewport",
}
type FillTranslateAnchorEnumValues = "map" | "viewport";
export enum LineCapEnum {
  /** A cap with a squared-off end which is drawn to the exact endpoint of the line. */
  Butt = "butt",
  /** A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line. */
  Round = "round",
  /** A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width. */
  Square = "square",
}
type LineCapEnumValues = "butt" | "round" | "square";
export enum LineJoinEnum {
  /** A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width. */
  Bevel = "bevel",
  /** A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line. */
  Round = "round",
  /** A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet. */
  Miter = "miter",
}
type LineJoinEnumValues = "bevel" | "round" | "miter";
export enum LineTranslateAnchorEnum {
  /** The line is translated relative to the map. */
  Map = "map",
  /** The line is translated relative to the viewport. */
  Viewport = "viewport",
}
type LineTranslateAnchorEnumValues = "map" | "viewport";
export enum SymbolPlacementEnum {
  /** The label is placed at the point where the geometry is located. */
  Point = "point",
  /** The label is placed along the line of the geometry. Can only be used on `LineString` and `Polygon` geometries. */
  Line = "line",
  /** The label is placed at the center of the line of the geometry. Can only be used on `LineString` and `Polygon` geometries. Note that a single feature in a vector tile may contain multiple line geometries. */
  LineCenter = "line-center",
}
type SymbolPlacementEnumValues = "point" | "line" | "line-center";
export enum SymbolZOrderEnum {
  /** Sorts symbols by `symbol-sort-key` if set. Otherwise, sorts symbols by their y-position relative to the viewport if `icon-allow-overlap` or `text-allow-overlap` is set to `true` or `icon-ignore-placement` or `text-ignore-placement` is `false`. */
  Auto = "auto",
  /** Sorts symbols by their y-position relative to the viewport if `icon-allow-overlap` or `text-allow-overlap` is set to `true` or `icon-ignore-placement` or `text-ignore-placement` is `false`. */
  ViewportY = "viewport-y",
  /** Sorts symbols by `symbol-sort-key` if set. Otherwise, no sorting is applied; symbols are rendered in the same order as the source data. */
  Source = "source",
}
type SymbolZOrderEnumValues = "auto" | "viewport-y" | "source";
export enum IconRotationAlignmentEnum {
  /** When `symbol-placement` is set to `point`, aligns icons east-west. When `symbol-placement` is set to `line` or `line-center`, aligns icon x-axes with the line. */
  Map = "map",
  /** Produces icons whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`. */
  Viewport = "viewport",
  /** When `symbol-placement` is set to `point`, this is equivalent to `viewport`. When `symbol-placement` is set to `line` or `line-center`, this is equivalent to `map`. */
  Auto = "auto",
}
type IconRotationAlignmentEnumValues = "map" | "viewport" | "auto";
export enum IconTextFitEnum {
  /** The icon is displayed at its intrinsic aspect ratio. */
  None = "none",
  /** The icon is scaled in the x-dimension to fit the width of the text. */
  Width = "width",
  /** The icon is scaled in the y-dimension to fit the height of the text. */
  Height = "height",
  /** The icon is scaled in both x- and y-dimensions. */
  Both = "both",
}
type IconTextFitEnumValues = "none" | "width" | "height" | "both";
export enum IconAnchorEnum {
  /** The center of the icon is placed closest to the anchor. */
  Center = "center",
  /** The left side of the icon is placed closest to the anchor. */
  Left = "left",
  /** The right side of the icon is placed closest to the anchor. */
  Right = "right",
  /** The top of the icon is placed closest to the anchor. */
  Top = "top",
  /** The bottom of the icon is placed closest to the anchor. */
  Bottom = "bottom",
  /** The top left corner of the icon is placed closest to the anchor. */
  TopLeft = "top-left",
  /** The top right corner of the icon is placed closest to the anchor. */
  TopRight = "top-right",
  /** The bottom left corner of the icon is placed closest to the anchor. */
  BottomLeft = "bottom-left",
  /** The bottom right corner of the icon is placed closest to the anchor. */
  BottomRight = "bottom-right",
}
type IconAnchorEnumValues =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export enum IconPitchAlignmentEnum {
  /** The icon is aligned to the plane of the map. */
  Map = "map",
  /** The icon is aligned to the plane of the viewport. */
  Viewport = "viewport",
  /** Automatically matches the value of `icon-rotation-alignment`. */
  Auto = "auto",
}
type IconPitchAlignmentEnumValues = "map" | "viewport" | "auto";
export enum TextPitchAlignmentEnum {
  /** The text is aligned to the plane of the map. */
  Map = "map",
  /** The text is aligned to the plane of the viewport. */
  Viewport = "viewport",
  /** Automatically matches the value of `text-rotation-alignment`. */
  Auto = "auto",
}
type TextPitchAlignmentEnumValues = "map" | "viewport" | "auto";
export enum TextRotationAlignmentEnum {
  /** When `symbol-placement` is set to `point`, aligns text east-west. When `symbol-placement` is set to `line` or `line-center`, aligns text x-axes with the line. */
  Map = "map",
  /** Produces glyphs whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`. */
  Viewport = "viewport",
  /** When `symbol-placement` is set to `point`, aligns text to the x-axis of the viewport. When `symbol-placement` is set to `line` or `line-center`, aligns glyphs to the x-axis of the viewport and places them along the line. */
  ViewportGlyph = "viewport-glyph",
  /** When `symbol-placement` is set to `point`, this is equivalent to `viewport`. When `symbol-placement` is set to `line` or `line-center`, this is equivalent to `map`. */
  Auto = "auto",
}
type TextRotationAlignmentEnumValues =
  | "map"
  | "viewport"
  | "viewport-glyph"
  | "auto";
export enum TextJustifyEnum {
  /** The text is aligned towards the anchor position. */
  Auto = "auto",
  /** The text is aligned to the left. */
  Left = "left",
  /** The text is centered. */
  Center = "center",
  /** The text is aligned to the right. */
  Right = "right",
}
type TextJustifyEnumValues = "auto" | "left" | "center" | "right";
export enum TextVariableAnchorEnum {
  /** The center of the text is placed closest to the anchor. */
  Center = "center",
  /** The left side of the text is placed closest to the anchor. */
  Left = "left",
  /** The right side of the text is placed closest to the anchor. */
  Right = "right",
  /** The top of the text is placed closest to the anchor. */
  Top = "top",
  /** The bottom of the text is placed closest to the anchor. */
  Bottom = "bottom",
  /** The top left corner of the text is placed closest to the anchor. */
  TopLeft = "top-left",
  /** The top right corner of the text is placed closest to the anchor. */
  TopRight = "top-right",
  /** The bottom left corner of the text is placed closest to the anchor. */
  BottomLeft = "bottom-left",
  /** The bottom right corner of the text is placed closest to the anchor. */
  BottomRight = "bottom-right",
}
type TextVariableAnchorEnumValues =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export enum TextAnchorEnum {
  /** The center of the text is placed closest to the anchor. */
  Center = "center",
  /** The left side of the text is placed closest to the anchor. */
  Left = "left",
  /** The right side of the text is placed closest to the anchor. */
  Right = "right",
  /** The top of the text is placed closest to the anchor. */
  Top = "top",
  /** The bottom of the text is placed closest to the anchor. */
  Bottom = "bottom",
  /** The top left corner of the text is placed closest to the anchor. */
  TopLeft = "top-left",
  /** The top right corner of the text is placed closest to the anchor. */
  TopRight = "top-right",
  /** The bottom left corner of the text is placed closest to the anchor. */
  BottomLeft = "bottom-left",
  /** The bottom right corner of the text is placed closest to the anchor. */
  BottomRight = "bottom-right",
}
type TextAnchorEnumValues =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export enum TextWritingModeEnum {
  /** If a text's language supports horizontal writing mode, symbols with point placement would be laid out horizontally. */
  Horizontal = "horizontal",
  /** If a text's language supports vertical writing mode, symbols with point placement would be laid out vertically. */
  Vertical = "vertical",
}
type TextWritingModeEnumValues = "horizontal" | "vertical";
export enum TextTransformEnum {
  /** The text is not altered. */
  None = "none",
  /** Forces all letters to be displayed in uppercase. */
  Uppercase = "uppercase",
  /** Forces all letters to be displayed in lowercase. */
  Lowercase = "lowercase",
}
type TextTransformEnumValues = "none" | "uppercase" | "lowercase";
export enum IconTranslateAnchorEnum {
  /** Icons are translated relative to the map. */
  Map = "map",
  /** Icons are translated relative to the viewport. */
  Viewport = "viewport",
}
type IconTranslateAnchorEnumValues = "map" | "viewport";
export enum TextTranslateAnchorEnum {
  /** The text is translated relative to the map. */
  Map = "map",
  /** The text is translated relative to the viewport. */
  Viewport = "viewport",
}
type TextTranslateAnchorEnumValues = "map" | "viewport";
export enum CircleTranslateAnchorEnum {
  /** The circle is translated relative to the map. */
  Map = "map",
  /** The circle is translated relative to the viewport. */
  Viewport = "viewport",
}
type CircleTranslateAnchorEnumValues = "map" | "viewport";
export enum CirclePitchScaleEnum {
  /** Circles are scaled according to their apparent distance to the camera. */
  Map = "map",
  /** Circles are not scaled. */
  Viewport = "viewport",
}
type CirclePitchScaleEnumValues = "map" | "viewport";
export enum CirclePitchAlignmentEnum {
  /** The circle is aligned to the plane of the map. */
  Map = "map",
  /** The circle is aligned to the plane of the viewport. */
  Viewport = "viewport",
}
type CirclePitchAlignmentEnumValues = "map" | "viewport";
export enum FillExtrusionTranslateAnchorEnum {
  /** The fill extrusion is translated relative to the map. */
  Map = "map",
  /** The fill extrusion is translated relative to the viewport. */
  Viewport = "viewport",
}
type FillExtrusionTranslateAnchorEnumValues = "map" | "viewport";
export enum RasterResamplingEnum {
  /** (Bi)linear filtering interpolates pixel values using the weighted average of the four closest original source pixels creating a smooth but blurry look when overscaled */
  Linear = "linear",
  /** Nearest neighbor filtering interpolates pixel values using the nearest original source pixel creating a sharp but pixelated look when overscaled */
  Nearest = "nearest",
}
type RasterResamplingEnumValues = "linear" | "nearest";
export enum HillshadeIlluminationAnchorEnum {
  /** The hillshade illumination is relative to the north direction. */
  Map = "map",
  /** The hillshade illumination is relative to the top of the viewport. */
  Viewport = "viewport",
}
type HillshadeIlluminationAnchorEnumValues = "map" | "viewport";
export enum AnchorEnum {
  /** The position of the light source is aligned to the rotation of the map. */
  Map = "map",
  /** The position of the light source is aligned to the rotation of the viewport. */
  Viewport = "viewport",
}
type AnchorEnumValues = "map" | "viewport";

type Enum<EnumType, EnumValues> = EnumType | EnumValues;

export interface FillLayerStyleProps {
  /**
   * Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.
   */
  fillSortKey?: number;
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * Whether or not the fill should be antialiased.
   */
  fillAntialias?: boolean;
  /**
   * The opacity of the entire fill layer. In contrast to the `fillColor`, this value will also affect the 1px stroke around the fill, if the stroke is used.
   */
  fillOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s fillOpacity property.
   */
  fillOpacityTransition?: Transition;
  /**
   * The color of the filled part of this layer. This color can be specified as `rgba` with an alpha component and the color's opacity will not affect the opacity of the 1px stroke, if it is used.
   *
   * @disabledBy fillPattern
   */
  fillColor?: string;

  /**
   * The transition affecting any changes to this layer’s fillColor property.
   */
  fillColorTransition?: Transition;
  /**
   * The outline color of the fill. Matches the value of `fillColor` if unspecified.
   *
   * @disabledBy fillPattern
   */
  fillOutlineColor?: string;

  /**
   * The transition affecting any changes to this layer’s fillOutlineColor property.
   */
  fillOutlineColorTransition?: Transition;
  /**
   * The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.
   */
  fillTranslate?: any[];

  /**
   * The transition affecting any changes to this layer’s fillTranslate property.
   */
  fillTranslateTransition?: Transition;
  /**
   * Controls the frame of reference for `fillTranslate`.
   *
   * @requires fillTranslate
   */
  fillTranslateAnchor?: "map" | "viewport";
  /**
   * Name of image in sprite to use for drawing image fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.
   */
  fillPattern?: string;

  /**
   * The transition affecting any changes to this layer’s fillPattern property.
   */
  fillPatternTransition?: Transition;
}
export interface LineLayerStyleProps {
  /**
   * The display of line endings.
   */
  lineCap?: "butt" | "round" | "square";
  /**
   * The display of lines when joining.
   */
  lineJoin?: "bevel" | "round" | "miter";
  /**
   * Used to automatically convert miter joins to bevel joins for sharp angles.
   */
  lineMiterLimit?: number;
  /**
   * Used to automatically convert round joins to miter joins for shallow angles.
   */
  lineRoundLimit?: number;
  /**
   * Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.
   */
  lineSortKey?: number;
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * The opacity at which the line will be drawn.
   */
  lineOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s lineOpacity property.
   */
  lineOpacityTransition?: Transition;
  /**
   * The color with which the line will be drawn.
   *
   * @disabledBy linePattern
   */
  lineColor?: string;

  /**
   * The transition affecting any changes to this layer’s lineColor property.
   */
  lineColorTransition?: Transition;
  /**
   * The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.
   */
  lineTranslate?: any[];

  /**
   * The transition affecting any changes to this layer’s lineTranslate property.
   */
  lineTranslateTransition?: Transition;
  /**
   * Controls the frame of reference for `lineTranslate`.
   *
   * @requires lineTranslate
   */
  lineTranslateAnchor?: "map" | "viewport";
  /**
   * Stroke thickness.
   */
  lineWidth?: number;

  /**
   * The transition affecting any changes to this layer’s lineWidth property.
   */
  lineWidthTransition?: Transition;
  /**
   * Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.
   */
  lineGapWidth?: number;

  /**
   * The transition affecting any changes to this layer’s lineGapWidth property.
   */
  lineGapWidthTransition?: Transition;
  /**
   * The line's offset. For linear features, a positive value offsets the line to the right, relative to the direction of the line, and a negative value to the left. For polygon features, a positive value results in an inset, and a negative value results in an outset.
   */
  lineOffset?: number;

  /**
   * The transition affecting any changes to this layer’s lineOffset property.
   */
  lineOffsetTransition?: Transition;
  /**
   * Blur applied to the line, in pixels.
   */
  lineBlur?: number;

  /**
   * The transition affecting any changes to this layer’s lineBlur property.
   */
  lineBlurTransition?: Transition;
  /**
   * Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width. Note that GeoJSON sources with `lineMetrics: true` specified won't render dashed lines to the expected scale. Also note that zoomDependent expressions will be evaluated only at integer zoom levels.
   *
   * @disabledBy linePattern
   */
  lineDasharray?: any[];

  /**
   * The transition affecting any changes to this layer’s lineDasharray property.
   */
  lineDasharrayTransition?: Transition;
  /**
   * Name of image in sprite to use for drawing image lines. For seamless patterns, image width must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.
   */
  linePattern?: string;

  /**
   * The transition affecting any changes to this layer’s linePattern property.
   */
  linePatternTransition?: Transition;
  /**
   * Defines a gradient with which to color a line feature. Can only be used with GeoJSON sources that specify `"lineMetrics": true`.
   *
   * @disabledBy lineDasharray, linePattern
   */
  lineGradient?: string;
}
export interface SymbolLayerStyleProps {
  /**
   * Label placement relative to its geometry.
   */
  symbolPlacement?: "point" | "line" | "line-center";
  /**
   * Distance between two symbol anchors.
   */
  symbolSpacing?: number;
  /**
   * If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer. When using a client that supports global collision detection, like MapLibre GL JS version 0.42.0 or greater, enabling this property is not needed to prevent clipped labels at tile boundaries.
   */
  symbolAvoidEdges?: boolean;
  /**
   * Sorts features in ascending order based on this value. Features with lower sort keys are drawn and placed first.  When `iconAllowOverlap` or `textAllowOverlap` is `false`, features with a lower sort key will have priority during placement. When `iconAllowOverlap` or `textAllowOverlap` is set to `true`, features with a higher sort key will overlap over features with a lower sort key.
   */
  symbolSortKey?: number;
  /**
   * Determines whether overlapping symbols in the same layer are rendered in the order that they appear in the data source or by their yPosition relative to the viewport. To control the order and prioritization of symbols otherwise, use `symbolSortKey`.
   */
  symbolZOrder?: "auto" | "viewport-y" | "source";
  /**
   * If true, the icon will be visible even if it collides with other previously drawn symbols.
   *
   * @requires iconImage
   *
   * @disabledBy iconOverlap
   */
  iconAllowOverlap?: boolean;
  /**
   * If true, other symbols can be visible even if they collide with the icon.
   *
   * @requires iconImage
   */
  iconIgnorePlacement?: boolean;
  /**
   * If true, text will display without their corresponding icons when the icon collides with other symbols and the text does not.
   *
   * @requires iconImage, textField
   */
  iconOptional?: boolean;
  /**
   * In combination with `symbolPlacement`, determines the rotation behavior of icons.
   *
   * @requires iconImage
   */
  iconRotationAlignment?: "map" | "viewport" | "auto";
  /**
   * Scales the original size of the icon by the provided factor. The new pixel size of the image will be the original pixel size multiplied by `iconSize`. 1 is the original size; 3 triples the size of the image.
   *
   * @requires iconImage
   */
  iconSize?: number;
  /**
   * Scales the icon to fit around the associated text.
   *
   * @requires iconImage, textField
   */
  iconTextFit?: "none" | "width" | "height" | "both";
  /**
   * Size of the additional area added to dimensions determined by `iconTextFit`, in clockwise order: top, right, bottom, left.
   *
   * @requires iconImage, textField
   */
  iconTextFitPadding?: any[];
  /**
   * Name of image in sprite to use for drawing an image background.
   */
  iconImage?: string;
  /**
   * Rotates the icon clockwise.
   *
   * @requires iconImage
   */
  iconRotate?: number;
  /**
   * Size of additional area round the icon bounding box used for detecting symbol collisions.
   *
   * @requires iconImage
   */
  iconPadding?: any[];
  /**
   * If true, the icon may be flipped to prevent it from being rendered upsideDown.
   *
   * @requires iconImage
   */
  iconKeepUpright?: boolean;
  /**
   * Offset distance of icon from its anchor. Positive values indicate right and down, while negative values indicate left and up. Each component is multiplied by the value of `iconSize` to obtain the final offset in pixels. When combined with `iconRotate` the offset will be as if the rotated direction was up.
   *
   * @requires iconImage
   */
  iconOffset?: any[];
  /**
   * Part of the icon placed closest to the anchor.
   *
   * @requires iconImage
   */
  iconAnchor?:
    | "center"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  /**
   * Orientation of icon when map is pitched.
   *
   * @requires iconImage
   */
  iconPitchAlignment?: "map" | "viewport" | "auto";
  /**
   * Orientation of text when map is pitched.
   *
   * @requires textField
   */
  textPitchAlignment?: "map" | "viewport" | "auto";
  /**
   * In combination with `symbolPlacement`, determines the rotation behavior of the individual glyphs forming the text.
   *
   * @requires textField
   */
  textRotationAlignment?: "map" | "viewport" | "viewport-glyph" | "auto";
  /**
   * Value to use for a text label. If a plain `string` is provided, it will be treated as a `formatted` with default/inherited formatting options.
   */
  textField?: string;
  /**
   * Font stack to use for displaying text.
   *
   * @requires textField
   */
  textFont?: any[];
  /**
   * Font size.
   *
   * @requires textField
   */
  textSize?: number;
  /**
   * The maximum line width for text wrapping.
   *
   * @requires textField
   */
  textMaxWidth?: number;
  /**
   * Text leading value for multiLine text.
   *
   * @requires textField
   */
  textLineHeight?: number;
  /**
   * Text tracking amount.
   *
   * @requires textField
   */
  textLetterSpacing?: number;
  /**
   * Text justification options.
   *
   * @requires textField
   */
  textJustify?: "auto" | "left" | "center" | "right";
  /**
   * Radial offset of text, in the direction of the symbol's anchor. Useful in combination with `textVariableAnchor`, which defaults to using the twoDimensional `textOffset` if present.
   *
   * @requires textField
   */
  textRadialOffset?: number;
  /**
   * To increase the chance of placing highPriority labels on the map, you can provide an array of `textAnchor` locations: the renderer will attempt to place the label at each location, in order, before moving onto the next label. Use `textJustify: auto` to choose justification based on anchor position. To apply an offset, use the `textRadialOffset` or the twoDimensional `textOffset`.
   *
   * @requires textField
   */
  textVariableAnchor?: any[];
  /**
   * Part of the text placed closest to the anchor.
   *
   * @requires textField
   *
   * @disabledBy textVariableAnchor
   */
  textAnchor?:
    | "center"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  /**
   * Maximum angle change between adjacent characters.
   *
   * @requires textField
   */
  textMaxAngle?: number;
  /**
   * The property allows control over a symbol's orientation. Note that the property values act as a hint, so that a symbol whose language doesn’t support the provided orientation will be laid out in its natural orientation. Example: English point symbol will be rendered horizontally even if array value contains single 'vertical' enum value. The order of elements in an array define priority order for the placement of an orientation variant.
   *
   * @requires textField
   */
  textWritingMode?: any[];
  /**
   * Rotates the text clockwise.
   *
   * @requires textField
   */
  textRotate?: number;
  /**
   * Size of the additional area around the text bounding box used for detecting symbol collisions.
   *
   * @requires textField
   */
  textPadding?: number;
  /**
   * If true, the text may be flipped vertically to prevent it from being rendered upsideDown.
   *
   * @requires textField
   */
  textKeepUpright?: boolean;
  /**
   * Specifies how to capitalize text, similar to the CSS `textTransform` property.
   *
   * @requires textField
   */
  textTransform?: "none" | "uppercase" | "lowercase";
  /**
   * Offset distance of text from its anchor. Positive values indicate right and down, while negative values indicate left and up. If used with textVariableAnchor, input values will be taken as absolute values. Offsets along the x and yAxis will be applied automatically based on the anchor position.
   *
   * @requires textField
   *
   * @disabledBy textRadialOffset
   */
  textOffset?: any[];
  /**
   * If true, the text will be visible even if it collides with other previously drawn symbols.
   *
   * @requires textField
   *
   * @disabledBy textOverlap
   */
  textAllowOverlap?: boolean;
  /**
   * If true, other symbols can be visible even if they collide with the text.
   *
   * @requires textField
   */
  textIgnorePlacement?: boolean;
  /**
   * If true, icons will display without their corresponding text when the text collides with other symbols and the icon does not.
   *
   * @requires textField, iconImage
   */
  textOptional?: boolean;
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * The opacity at which the icon will be drawn.
   *
   * @requires iconImage
   */
  iconOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s iconOpacity property.
   */
  iconOpacityTransition?: Transition;
  /**
   * The color of the icon. This can only be used with SDF icons.
   *
   * @requires iconImage
   */
  iconColor?: string;

  /**
   * The transition affecting any changes to this layer’s iconColor property.
   */
  iconColorTransition?: Transition;
  /**
   * The color of the icon's halo. Icon halos can only be used with SDF icons.
   *
   * @requires iconImage
   */
  iconHaloColor?: string;

  /**
   * The transition affecting any changes to this layer’s iconHaloColor property.
   */
  iconHaloColorTransition?: Transition;
  /**
       * Distance of halo to the icon outline. 

The unit is in pixels only for SDF sprites that were created with a blur radius of 8, multiplied by the display density. I.e., the radius needs to be 16 for `@2x` sprites, etc.
       *
       * @requires iconImage
       */
  iconHaloWidth?: number;

  /**
   * The transition affecting any changes to this layer’s iconHaloWidth property.
   */
  iconHaloWidthTransition?: Transition;
  /**
   * Fade out the halo towards the outside.
   *
   * @requires iconImage
   */
  iconHaloBlur?: number;

  /**
   * The transition affecting any changes to this layer’s iconHaloBlur property.
   */
  iconHaloBlurTransition?: Transition;
  /**
   * Distance that the icon's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.
   *
   * @requires iconImage
   */
  iconTranslate?: any[];

  /**
   * The transition affecting any changes to this layer’s iconTranslate property.
   */
  iconTranslateTransition?: Transition;
  /**
   * Controls the frame of reference for `iconTranslate`.
   *
   * @requires iconImage, iconTranslate
   */
  iconTranslateAnchor?: "map" | "viewport";
  /**
   * The opacity at which the text will be drawn.
   *
   * @requires textField
   */
  textOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s textOpacity property.
   */
  textOpacityTransition?: Transition;
  /**
   * The color with which the text will be drawn.
   *
   * @requires textField
   */
  textColor?: string;

  /**
   * The transition affecting any changes to this layer’s textColor property.
   */
  textColorTransition?: Transition;
  /**
   * The color of the text's halo, which helps it stand out from backgrounds.
   *
   * @requires textField
   */
  textHaloColor?: string;

  /**
   * The transition affecting any changes to this layer’s textHaloColor property.
   */
  textHaloColorTransition?: Transition;
  /**
   * Distance of halo to the font outline. Max text halo width is 1/4 of the fontSize.
   *
   * @requires textField
   */
  textHaloWidth?: number;

  /**
   * The transition affecting any changes to this layer’s textHaloWidth property.
   */
  textHaloWidthTransition?: Transition;
  /**
   * The halo's fadeout distance towards the outside.
   *
   * @requires textField
   */
  textHaloBlur?: number;

  /**
   * The transition affecting any changes to this layer’s textHaloBlur property.
   */
  textHaloBlurTransition?: Transition;
  /**
   * Distance that the text's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.
   *
   * @requires textField
   */
  textTranslate?: any[];

  /**
   * The transition affecting any changes to this layer’s textTranslate property.
   */
  textTranslateTransition?: Transition;
  /**
   * Controls the frame of reference for `textTranslate`.
   *
   * @requires textField, textTranslate
   */
  textTranslateAnchor?: "map" | "viewport";
}
export interface CircleLayerStyleProps {
  /**
   * Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.
   */
  circleSortKey?: number;
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * Circle radius.
   */
  circleRadius?: number;

  /**
   * The transition affecting any changes to this layer’s circleRadius property.
   */
  circleRadiusTransition?: Transition;
  /**
   * The fill color of the circle.
   */
  circleColor?: string;

  /**
   * The transition affecting any changes to this layer’s circleColor property.
   */
  circleColorTransition?: Transition;
  /**
   * Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.
   */
  circleBlur?: number;

  /**
   * The transition affecting any changes to this layer’s circleBlur property.
   */
  circleBlurTransition?: Transition;
  /**
   * The opacity at which the circle will be drawn.
   */
  circleOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s circleOpacity property.
   */
  circleOpacityTransition?: Transition;
  /**
   * The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively.
   */
  circleTranslate?: any[];

  /**
   * The transition affecting any changes to this layer’s circleTranslate property.
   */
  circleTranslateTransition?: Transition;
  /**
   * Controls the frame of reference for `circleTranslate`.
   *
   * @requires circleTranslate
   */
  circleTranslateAnchor?: "map" | "viewport";
  /**
   * Controls the scaling behavior of the circle when the map is pitched.
   */
  circlePitchScale?: "map" | "viewport";
  /**
   * Orientation of circle when map is pitched.
   */
  circlePitchAlignment?: "map" | "viewport";
  /**
   * The width of the circle's stroke. Strokes are placed outside of the `circleRadius`.
   */
  circleStrokeWidth?: number;

  /**
   * The transition affecting any changes to this layer’s circleStrokeWidth property.
   */
  circleStrokeWidthTransition?: Transition;
  /**
   * The stroke color of the circle.
   */
  circleStrokeColor?: string;

  /**
   * The transition affecting any changes to this layer’s circleStrokeColor property.
   */
  circleStrokeColorTransition?: Transition;
  /**
   * The opacity of the circle's stroke.
   */
  circleStrokeOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s circleStrokeOpacity property.
   */
  circleStrokeOpacityTransition?: Transition;
}
export interface HeatmapLayerStyleProps {
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * Radius of influence of one heatmap point in pixels. Increasing the value makes the heatmap smoother, but less detailed.
   */
  heatmapRadius?: number;

  /**
   * The transition affecting any changes to this layer’s heatmapRadius property.
   */
  heatmapRadiusTransition?: Transition;
  /**
   * A measure of how much an individual point contributes to the heatmap. A value of 10 would be equivalent to having 10 points of weight 1 in the same spot. Especially useful when combined with clustering.
   */
  heatmapWeight?: number;
  /**
   * Similar to `heatmapWeight` but controls the intensity of the heatmap globally. Primarily used for adjusting the heatmap based on zoom level.
   */
  heatmapIntensity?: number;

  /**
   * The transition affecting any changes to this layer’s heatmapIntensity property.
   */
  heatmapIntensityTransition?: Transition;
  /**
   * Defines the color of each pixel based on its density value in a heatmap.  Should be an expression that uses `["heatmapDensity"]` as input.
   */
  heatmapColor?: string;
  /**
   * The global opacity at which the heatmap layer will be drawn.
   */
  heatmapOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s heatmapOpacity property.
   */
  heatmapOpacityTransition?: Transition;
}
export interface FillExtrusionLayerStyleProps {
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * The opacity of the entire fill extrusion layer. This is rendered on a perLayer, not perFeature, basis, and dataDriven styling is not available.
   */
  fillExtrusionOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s fillExtrusionOpacity property.
   */
  fillExtrusionOpacityTransition?: Transition;
  /**
   * The base color of the extruded fill. The extrusion's surfaces will be shaded differently based on this color in combination with the root `light` settings. If this color is specified as `rgba` with an alpha component, the alpha component will be ignored; use `fillExtrusionOpacity` to set layer opacity.
   *
   * @disabledBy fillExtrusionPattern
   */
  fillExtrusionColor?: string;

  /**
   * The transition affecting any changes to this layer’s fillExtrusionColor property.
   */
  fillExtrusionColorTransition?: Transition;
  /**
   * The geometry's offset. Values are [x, y] where negatives indicate left and up (on the flat plane), respectively.
   */
  fillExtrusionTranslate?: any[];

  /**
   * The transition affecting any changes to this layer’s fillExtrusionTranslate property.
   */
  fillExtrusionTranslateTransition?: Transition;
  /**
   * Controls the frame of reference for `fillExtrusionTranslate`.
   *
   * @requires fillExtrusionTranslate
   */
  fillExtrusionTranslateAnchor?: "map" | "viewport";
  /**
   * Name of image in sprite to use for drawing images on extruded fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.
   */
  fillExtrusionPattern?: string;

  /**
   * The transition affecting any changes to this layer’s fillExtrusionPattern property.
   */
  fillExtrusionPatternTransition?: Transition;
  /**
   * The height with which to extrude this layer.
   */
  fillExtrusionHeight?: number;

  /**
   * The transition affecting any changes to this layer’s fillExtrusionHeight property.
   */
  fillExtrusionHeightTransition?: Transition;
  /**
   * The height with which to extrude the base of this layer. Must be less than or equal to `fillExtrusionHeight`.
   *
   * @requires fillExtrusionHeight
   */
  fillExtrusionBase?: number;

  /**
   * The transition affecting any changes to this layer’s fillExtrusionBase property.
   */
  fillExtrusionBaseTransition?: Transition;
  /**
   * Whether to apply a vertical gradient to the sides of a fillExtrusion layer. If true, sides will be shaded slightly darker farther down.
   */
  fillExtrusionVerticalGradient?: boolean;
}
export interface RasterLayerStyleProps {
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * The opacity at which the image will be drawn.
   */
  rasterOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s rasterOpacity property.
   */
  rasterOpacityTransition?: Transition;
  /**
   * Rotates hues around the color wheel.
   */
  rasterHueRotate?: number;

  /**
   * The transition affecting any changes to this layer’s rasterHueRotate property.
   */
  rasterHueRotateTransition?: Transition;
  /**
   * Increase or reduce the brightness of the image. The value is the minimum brightness.
   */
  rasterBrightnessMin?: number;

  /**
   * The transition affecting any changes to this layer’s rasterBrightnessMin property.
   */
  rasterBrightnessMinTransition?: Transition;
  /**
   * Increase or reduce the brightness of the image. The value is the maximum brightness.
   */
  rasterBrightnessMax?: number;

  /**
   * The transition affecting any changes to this layer’s rasterBrightnessMax property.
   */
  rasterBrightnessMaxTransition?: Transition;
  /**
   * Increase or reduce the saturation of the image.
   */
  rasterSaturation?: number;

  /**
   * The transition affecting any changes to this layer’s rasterSaturation property.
   */
  rasterSaturationTransition?: Transition;
  /**
   * Increase or reduce the contrast of the image.
   */
  rasterContrast?: number;

  /**
   * The transition affecting any changes to this layer’s rasterContrast property.
   */
  rasterContrastTransition?: Transition;
  /**
   * The resampling/interpolation method to use for overscaling, also known as texture magnification filter
   */
  rasterResampling?: "linear" | "nearest";
  /**
   * Fade duration when a new tile is added, or when a video is started or its coordinates are updated.
   */
  rasterFadeDuration?: number;
}
export interface HillshadeLayerStyleProps {
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * The direction of the light source used to generate the hillshading with 0 as the top of the viewport if `hillshadeIlluminationAnchor` is set to `viewport` and due north if `hillshadeIlluminationAnchor` is set to `map`.
   */
  hillshadeIlluminationDirection?: number;
  /**
   * Direction of light source when map is rotated.
   */
  hillshadeIlluminationAnchor?: "map" | "viewport";
  /**
   * Intensity of the hillshade
   */
  hillshadeExaggeration?: number;

  /**
   * The transition affecting any changes to this layer’s hillshadeExaggeration property.
   */
  hillshadeExaggerationTransition?: Transition;
  /**
   * The shading color of areas that face away from the light source.
   */
  hillshadeShadowColor?: string;

  /**
   * The transition affecting any changes to this layer’s hillshadeShadowColor property.
   */
  hillshadeShadowColorTransition?: Transition;
  /**
   * The shading color of areas that faces towards the light source.
   */
  hillshadeHighlightColor?: string;

  /**
   * The transition affecting any changes to this layer’s hillshadeHighlightColor property.
   */
  hillshadeHighlightColorTransition?: Transition;
  /**
   * The shading color used to accentuate rugged terrain like sharp cliffs and gorges.
   */
  hillshadeAccentColor?: string;

  /**
   * The transition affecting any changes to this layer’s hillshadeAccentColor property.
   */
  hillshadeAccentColorTransition?: Transition;
}
export interface BackgroundLayerStyleProps {
  /**
   * Whether this layer is displayed.
   */
  visibility?: "visible" | "none";
  /**
   * The color with which the background will be drawn.
   *
   * @disabledBy backgroundPattern
   */
  backgroundColor?: string;

  /**
   * The transition affecting any changes to this layer’s backgroundColor property.
   */
  backgroundColorTransition?: Transition;
  /**
   * Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoomDependent expressions will be evaluated only at integer zoom levels.
   */
  backgroundPattern?: string;

  /**
   * The transition affecting any changes to this layer’s backgroundPattern property.
   */
  backgroundPatternTransition?: Transition;
  /**
   * The opacity at which the background will be drawn.
   */
  backgroundOpacity?: number;

  /**
   * The transition affecting any changes to this layer’s backgroundOpacity property.
   */
  backgroundOpacityTransition?: Transition;
}
export interface LightLayerStyleProps {
  /**
   * Whether extruded geometries are lit relative to the map or viewport.
   */
  anchor?: "map" | "viewport";
  /**
   * Position of the light source relative to lit (extruded) geometries, in [r radial coordinate, a azimuthal angle, p polar angle] where r indicates the distance from the center of the base of an object to its light, a indicates the position of the light relative to 0° (0° when `light.anchor` is set to `viewport` corresponds to the top of the viewport, or 0° when `light.anchor` is set to `map` corresponds to due north, and degrees proceed clockwise), and p indicates the height of the light (from 0°, directly above, to 180°, directly below).
   */
  position?: any[];

  /**
   * The transition affecting any changes to this layer’s position property.
   */
  positionTransition?: Transition;
  /**
   * Color tint for lighting extruded geometries.
   */
  color?: string;

  /**
   * The transition affecting any changes to this layer’s color property.
   */
  colorTransition?: Transition;
  /**
   * Intensity of lighting (on a scale from 0 to 1). Higher numbers will present as more extreme contrast.
   */
  intensity?: number;

  /**
   * The transition affecting any changes to this layer’s intensity property.
   */
  intensityTransition?: Transition;
}

export type AllLayerStyleProps =
  | FillLayerStyleProps
  | LineLayerStyleProps
  | SymbolLayerStyleProps
  | CircleLayerStyleProps
  | HeatmapLayerStyleProps
  | FillExtrusionLayerStyleProps
  | RasterLayerStyleProps
  | HillshadeLayerStyleProps
  | BackgroundLayerStyleProps
  | LightLayerStyleProps;
