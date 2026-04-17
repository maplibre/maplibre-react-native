// DO NOT MODIFY
// This file is auto-generated from scripts/src/templates/renderMLRNStyleFactory.ts
package org.maplibre.reactnative.components.layer.style

import org.maplibre.android.style.layers.BackgroundLayer
import org.maplibre.android.style.layers.CircleLayer
import org.maplibre.android.style.layers.FillExtrusionLayer
import org.maplibre.android.style.layers.FillLayer
import org.maplibre.android.style.layers.HeatmapLayer
import org.maplibre.android.style.layers.HillshadeLayer
import org.maplibre.android.style.layers.LineLayer
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.android.style.layers.RasterLayer
import org.maplibre.android.style.layers.SymbolLayer
import org.maplibre.android.style.light.Light
import org.maplibre.android.style.light.Position

object MLRNStyleFactory {
    const val VALUE_KEY: String = "value"

    fun setFillLayerStyle(
        layer: FillLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "fillSortKey" -> {
                    setFillSortKey(layer, styleValue)
                }

                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "fillAntialias" -> {
                    setFillAntialias(layer, styleValue)
                }

                "fillOpacity" -> {
                    setFillOpacity(layer, styleValue)
                }

                "fillOpacityTransition" -> {
                    setFillOpacityTransition(layer, styleValue)
                }

                "fillColor" -> {
                    setFillColor(layer, styleValue)
                }

                "fillColorTransition" -> {
                    setFillColorTransition(layer, styleValue)
                }

                "fillOutlineColor" -> {
                    setFillOutlineColor(layer, styleValue)
                }

                "fillOutlineColorTransition" -> {
                    setFillOutlineColorTransition(layer, styleValue)
                }

                "fillTranslate" -> {
                    setFillTranslate(layer, styleValue)
                }

                "fillTranslateTransition" -> {
                    setFillTranslateTransition(layer, styleValue)
                }

                "fillTranslateAnchor" -> {
                    setFillTranslateAnchor(layer, styleValue)
                }

                "fillPattern" -> {
                    style.addImage(
                        styleValue,
                    ) { setFillPattern(layer, styleValue) }
                }

                "fillPatternTransition" -> {
                    setFillPatternTransition(layer, styleValue)
                }
            }
        }
    }

    fun setLineLayerStyle(
        layer: LineLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "lineCap" -> {
                    setLineCap(layer, styleValue)
                }

                "lineJoin" -> {
                    setLineJoin(layer, styleValue)
                }

                "lineMiterLimit" -> {
                    setLineMiterLimit(layer, styleValue)
                }

                "lineRoundLimit" -> {
                    setLineRoundLimit(layer, styleValue)
                }

                "lineSortKey" -> {
                    setLineSortKey(layer, styleValue)
                }

                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "lineOpacity" -> {
                    setLineOpacity(layer, styleValue)
                }

                "lineOpacityTransition" -> {
                    setLineOpacityTransition(layer, styleValue)
                }

                "lineColor" -> {
                    setLineColor(layer, styleValue)
                }

                "lineColorTransition" -> {
                    setLineColorTransition(layer, styleValue)
                }

                "lineTranslate" -> {
                    setLineTranslate(layer, styleValue)
                }

                "lineTranslateTransition" -> {
                    setLineTranslateTransition(layer, styleValue)
                }

                "lineTranslateAnchor" -> {
                    setLineTranslateAnchor(layer, styleValue)
                }

                "lineWidth" -> {
                    setLineWidth(layer, styleValue)
                }

                "lineWidthTransition" -> {
                    setLineWidthTransition(layer, styleValue)
                }

                "lineGapWidth" -> {
                    setLineGapWidth(layer, styleValue)
                }

                "lineGapWidthTransition" -> {
                    setLineGapWidthTransition(layer, styleValue)
                }

                "lineOffset" -> {
                    setLineOffset(layer, styleValue)
                }

                "lineOffsetTransition" -> {
                    setLineOffsetTransition(layer, styleValue)
                }

                "lineBlur" -> {
                    setLineBlur(layer, styleValue)
                }

                "lineBlurTransition" -> {
                    setLineBlurTransition(layer, styleValue)
                }

                "lineDasharray" -> {
                    setLineDasharray(layer, styleValue)
                }

                "lineDasharrayTransition" -> {
                    setLineDasharrayTransition(layer, styleValue)
                }

                "linePattern" -> {
                    style.addImage(
                        styleValue,
                    ) { setLinePattern(layer, styleValue) }
                }

                "linePatternTransition" -> {
                    setLinePatternTransition(layer, styleValue)
                }

                "lineGradient" -> {
                    setLineGradient(layer, styleValue)
                }
            }
        }
    }

    fun setSymbolLayerStyle(
        layer: SymbolLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "symbolPlacement" -> {
                    setSymbolPlacement(layer, styleValue)
                }

                "symbolSpacing" -> {
                    setSymbolSpacing(layer, styleValue)
                }

                "symbolAvoidEdges" -> {
                    setSymbolAvoidEdges(layer, styleValue)
                }

                "symbolSortKey" -> {
                    setSymbolSortKey(layer, styleValue)
                }

                "symbolZOrder" -> {
                    setSymbolZOrder(layer, styleValue)
                }

                "iconAllowOverlap" -> {
                    setIconAllowOverlap(layer, styleValue)
                }

                "iconIgnorePlacement" -> {
                    setIconIgnorePlacement(layer, styleValue)
                }

                "iconOptional" -> {
                    setIconOptional(layer, styleValue)
                }

                "iconRotationAlignment" -> {
                    setIconRotationAlignment(layer, styleValue)
                }

                "iconSize" -> {
                    setIconSize(layer, styleValue)
                }

                "iconTextFit" -> {
                    setIconTextFit(layer, styleValue)
                }

                "iconTextFitPadding" -> {
                    setIconTextFitPadding(layer, styleValue)
                }

                "iconImage" -> {
                    style.addImage(
                        styleValue,
                    ) { setIconImage(layer, styleValue) }
                }

                "iconRotate" -> {
                    setIconRotate(layer, styleValue)
                }

                "iconPadding" -> {
                    setIconPadding(layer, styleValue)
                }

                "iconKeepUpright" -> {
                    setIconKeepUpright(layer, styleValue)
                }

                "iconOffset" -> {
                    setIconOffset(layer, styleValue)
                }

                "iconAnchor" -> {
                    setIconAnchor(layer, styleValue)
                }

                "iconPitchAlignment" -> {
                    setIconPitchAlignment(layer, styleValue)
                }

                "textPitchAlignment" -> {
                    setTextPitchAlignment(layer, styleValue)
                }

                "textRotationAlignment" -> {
                    setTextRotationAlignment(layer, styleValue)
                }

                "textField" -> {
                    setTextField(layer, styleValue)
                }

                "textFont" -> {
                    setTextFont(layer, styleValue)
                }

                "textSize" -> {
                    setTextSize(layer, styleValue)
                }

                "textMaxWidth" -> {
                    setTextMaxWidth(layer, styleValue)
                }

                "textLineHeight" -> {
                    setTextLineHeight(layer, styleValue)
                }

                "textLetterSpacing" -> {
                    setTextLetterSpacing(layer, styleValue)
                }

                "textJustify" -> {
                    setTextJustify(layer, styleValue)
                }

                "textRadialOffset" -> {
                    setTextRadialOffset(layer, styleValue)
                }

                "textVariableAnchor" -> {
                    setTextVariableAnchor(layer, styleValue)
                }

                "textAnchor" -> {
                    setTextAnchor(layer, styleValue)
                }

                "textMaxAngle" -> {
                    setTextMaxAngle(layer, styleValue)
                }

                "textWritingMode" -> {
                    setTextWritingMode(layer, styleValue)
                }

                "textRotate" -> {
                    setTextRotate(layer, styleValue)
                }

                "textPadding" -> {
                    setTextPadding(layer, styleValue)
                }

                "textKeepUpright" -> {
                    setTextKeepUpright(layer, styleValue)
                }

                "textTransform" -> {
                    setTextTransform(layer, styleValue)
                }

                "textOffset" -> {
                    setTextOffset(layer, styleValue)
                }

                "textAllowOverlap" -> {
                    setTextAllowOverlap(layer, styleValue)
                }

                "textIgnorePlacement" -> {
                    setTextIgnorePlacement(layer, styleValue)
                }

                "textOptional" -> {
                    setTextOptional(layer, styleValue)
                }

                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "iconOpacity" -> {
                    setIconOpacity(layer, styleValue)
                }

                "iconOpacityTransition" -> {
                    setIconOpacityTransition(layer, styleValue)
                }

                "iconColor" -> {
                    setIconColor(layer, styleValue)
                }

                "iconColorTransition" -> {
                    setIconColorTransition(layer, styleValue)
                }

                "iconHaloColor" -> {
                    setIconHaloColor(layer, styleValue)
                }

                "iconHaloColorTransition" -> {
                    setIconHaloColorTransition(layer, styleValue)
                }

                "iconHaloWidth" -> {
                    setIconHaloWidth(layer, styleValue)
                }

                "iconHaloWidthTransition" -> {
                    setIconHaloWidthTransition(layer, styleValue)
                }

                "iconHaloBlur" -> {
                    setIconHaloBlur(layer, styleValue)
                }

                "iconHaloBlurTransition" -> {
                    setIconHaloBlurTransition(layer, styleValue)
                }

                "iconTranslate" -> {
                    setIconTranslate(layer, styleValue)
                }

                "iconTranslateTransition" -> {
                    setIconTranslateTransition(layer, styleValue)
                }

                "iconTranslateAnchor" -> {
                    setIconTranslateAnchor(layer, styleValue)
                }

                "textOpacity" -> {
                    setTextOpacity(layer, styleValue)
                }

                "textOpacityTransition" -> {
                    setTextOpacityTransition(layer, styleValue)
                }

                "textColor" -> {
                    setTextColor(layer, styleValue)
                }

                "textColorTransition" -> {
                    setTextColorTransition(layer, styleValue)
                }

                "textHaloColor" -> {
                    setTextHaloColor(layer, styleValue)
                }

                "textHaloColorTransition" -> {
                    setTextHaloColorTransition(layer, styleValue)
                }

                "textHaloWidth" -> {
                    setTextHaloWidth(layer, styleValue)
                }

                "textHaloWidthTransition" -> {
                    setTextHaloWidthTransition(layer, styleValue)
                }

                "textHaloBlur" -> {
                    setTextHaloBlur(layer, styleValue)
                }

                "textHaloBlurTransition" -> {
                    setTextHaloBlurTransition(layer, styleValue)
                }

                "textTranslate" -> {
                    setTextTranslate(layer, styleValue)
                }

                "textTranslateTransition" -> {
                    setTextTranslateTransition(layer, styleValue)
                }

                "textTranslateAnchor" -> {
                    setTextTranslateAnchor(layer, styleValue)
                }
            }
        }
    }

    fun setCircleLayerStyle(
        layer: CircleLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "circleSortKey" -> {
                    setCircleSortKey(layer, styleValue)
                }

                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "circleRadius" -> {
                    setCircleRadius(layer, styleValue)
                }

                "circleRadiusTransition" -> {
                    setCircleRadiusTransition(layer, styleValue)
                }

                "circleColor" -> {
                    setCircleColor(layer, styleValue)
                }

                "circleColorTransition" -> {
                    setCircleColorTransition(layer, styleValue)
                }

                "circleBlur" -> {
                    setCircleBlur(layer, styleValue)
                }

                "circleBlurTransition" -> {
                    setCircleBlurTransition(layer, styleValue)
                }

                "circleOpacity" -> {
                    setCircleOpacity(layer, styleValue)
                }

                "circleOpacityTransition" -> {
                    setCircleOpacityTransition(layer, styleValue)
                }

                "circleTranslate" -> {
                    setCircleTranslate(layer, styleValue)
                }

                "circleTranslateTransition" -> {
                    setCircleTranslateTransition(layer, styleValue)
                }

                "circleTranslateAnchor" -> {
                    setCircleTranslateAnchor(layer, styleValue)
                }

                "circlePitchScale" -> {
                    setCirclePitchScale(layer, styleValue)
                }

                "circlePitchAlignment" -> {
                    setCirclePitchAlignment(layer, styleValue)
                }

                "circleStrokeWidth" -> {
                    setCircleStrokeWidth(layer, styleValue)
                }

                "circleStrokeWidthTransition" -> {
                    setCircleStrokeWidthTransition(layer, styleValue)
                }

                "circleStrokeColor" -> {
                    setCircleStrokeColor(layer, styleValue)
                }

                "circleStrokeColorTransition" -> {
                    setCircleStrokeColorTransition(layer, styleValue)
                }

                "circleStrokeOpacity" -> {
                    setCircleStrokeOpacity(layer, styleValue)
                }

                "circleStrokeOpacityTransition" -> {
                    setCircleStrokeOpacityTransition(layer, styleValue)
                }
            }
        }
    }

    fun setHeatmapLayerStyle(
        layer: HeatmapLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "heatmapRadius" -> {
                    setHeatmapRadius(layer, styleValue)
                }

                "heatmapRadiusTransition" -> {
                    setHeatmapRadiusTransition(layer, styleValue)
                }

                "heatmapWeight" -> {
                    setHeatmapWeight(layer, styleValue)
                }

                "heatmapIntensity" -> {
                    setHeatmapIntensity(layer, styleValue)
                }

                "heatmapIntensityTransition" -> {
                    setHeatmapIntensityTransition(layer, styleValue)
                }

                "heatmapColor" -> {
                    setHeatmapColor(layer, styleValue)
                }

                "heatmapOpacity" -> {
                    setHeatmapOpacity(layer, styleValue)
                }

                "heatmapOpacityTransition" -> {
                    setHeatmapOpacityTransition(layer, styleValue)
                }
            }
        }
    }

    fun setFillExtrusionLayerStyle(
        layer: FillExtrusionLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "fillExtrusionOpacity" -> {
                    setFillExtrusionOpacity(layer, styleValue)
                }

                "fillExtrusionOpacityTransition" -> {
                    setFillExtrusionOpacityTransition(layer, styleValue)
                }

                "fillExtrusionColor" -> {
                    setFillExtrusionColor(layer, styleValue)
                }

                "fillExtrusionColorTransition" -> {
                    setFillExtrusionColorTransition(layer, styleValue)
                }

                "fillExtrusionTranslate" -> {
                    setFillExtrusionTranslate(layer, styleValue)
                }

                "fillExtrusionTranslateTransition" -> {
                    setFillExtrusionTranslateTransition(layer, styleValue)
                }

                "fillExtrusionTranslateAnchor" -> {
                    setFillExtrusionTranslateAnchor(layer, styleValue)
                }

                "fillExtrusionPattern" -> {
                    style.addImage(
                        styleValue,
                    ) { setFillExtrusionPattern(layer, styleValue) }
                }

                "fillExtrusionPatternTransition" -> {
                    setFillExtrusionPatternTransition(layer, styleValue)
                }

                "fillExtrusionHeight" -> {
                    setFillExtrusionHeight(layer, styleValue)
                }

                "fillExtrusionHeightTransition" -> {
                    setFillExtrusionHeightTransition(layer, styleValue)
                }

                "fillExtrusionBase" -> {
                    setFillExtrusionBase(layer, styleValue)
                }

                "fillExtrusionBaseTransition" -> {
                    setFillExtrusionBaseTransition(layer, styleValue)
                }

                "fillExtrusionVerticalGradient" -> {
                    setFillExtrusionVerticalGradient(layer, styleValue)
                }
            }
        }
    }

    fun setRasterLayerStyle(
        layer: RasterLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "rasterOpacity" -> {
                    setRasterOpacity(layer, styleValue)
                }

                "rasterOpacityTransition" -> {
                    setRasterOpacityTransition(layer, styleValue)
                }

                "rasterHueRotate" -> {
                    setRasterHueRotate(layer, styleValue)
                }

                "rasterHueRotateTransition" -> {
                    setRasterHueRotateTransition(layer, styleValue)
                }

                "rasterBrightnessMin" -> {
                    setRasterBrightnessMin(layer, styleValue)
                }

                "rasterBrightnessMinTransition" -> {
                    setRasterBrightnessMinTransition(layer, styleValue)
                }

                "rasterBrightnessMax" -> {
                    setRasterBrightnessMax(layer, styleValue)
                }

                "rasterBrightnessMaxTransition" -> {
                    setRasterBrightnessMaxTransition(layer, styleValue)
                }

                "rasterSaturation" -> {
                    setRasterSaturation(layer, styleValue)
                }

                "rasterSaturationTransition" -> {
                    setRasterSaturationTransition(layer, styleValue)
                }

                "rasterContrast" -> {
                    setRasterContrast(layer, styleValue)
                }

                "rasterContrastTransition" -> {
                    setRasterContrastTransition(layer, styleValue)
                }

                "rasterResampling" -> {
                    setRasterResampling(layer, styleValue)
                }

                "rasterFadeDuration" -> {
                    setRasterFadeDuration(layer, styleValue)
                }
            }
        }
    }

    fun setHillshadeLayerStyle(
        layer: HillshadeLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "hillshadeIlluminationDirection" -> {
                    setHillshadeIlluminationDirection(layer, styleValue)
                }

                "hillshadeIlluminationAnchor" -> {
                    setHillshadeIlluminationAnchor(layer, styleValue)
                }

                "hillshadeExaggeration" -> {
                    setHillshadeExaggeration(layer, styleValue)
                }

                "hillshadeExaggerationTransition" -> {
                    setHillshadeExaggerationTransition(layer, styleValue)
                }

                "hillshadeShadowColor" -> {
                    setHillshadeShadowColor(layer, styleValue)
                }

                "hillshadeShadowColorTransition" -> {
                    setHillshadeShadowColorTransition(layer, styleValue)
                }

                "hillshadeHighlightColor" -> {
                    setHillshadeHighlightColor(layer, styleValue)
                }

                "hillshadeHighlightColorTransition" -> {
                    setHillshadeHighlightColorTransition(layer, styleValue)
                }

                "hillshadeAccentColor" -> {
                    setHillshadeAccentColor(layer, styleValue)
                }

                "hillshadeAccentColorTransition" -> {
                    setHillshadeAccentColorTransition(layer, styleValue)
                }
            }
        }
    }

    fun setBackgroundLayerStyle(
        layer: BackgroundLayer,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "visibility" -> {
                    setVisibility(layer, styleValue)
                }

                "backgroundColor" -> {
                    setBackgroundColor(layer, styleValue)
                }

                "backgroundColorTransition" -> {
                    setBackgroundColorTransition(layer, styleValue)
                }

                "backgroundPattern" -> {
                    style.addImage(
                        styleValue,
                    ) { setBackgroundPattern(layer, styleValue) }
                }

                "backgroundPatternTransition" -> {
                    setBackgroundPatternTransition(layer, styleValue)
                }

                "backgroundOpacity" -> {
                    setBackgroundOpacity(layer, styleValue)
                }

                "backgroundOpacityTransition" -> {
                    setBackgroundOpacityTransition(layer, styleValue)
                }
            }
        }
    }

    fun setLightLayerStyle(
        layer: Light,
        style: MLRNStyle,
    ) {
        val styleKeys = style.allStyleKeys

        if (styleKeys.isEmpty()) {
            return
        }

        for (styleKey in styleKeys) {
            val styleValue = style.getStyleValueForKey(styleKey)

            when (styleKey) {
                "anchor" -> {
                    setAnchor(layer, styleValue)
                }

                "position" -> {
                    setPosition(layer, styleValue)
                }

                "positionTransition" -> {
                    setPositionTransition(layer, styleValue)
                }

                "color" -> {
                    setColor(layer, styleValue)
                }

                "colorTransition" -> {
                    setColorTransition(layer, styleValue)
                }

                "intensity" -> {
                    setIntensity(layer, styleValue)
                }

                "intensityTransition" -> {
                    setIntensityTransition(layer, styleValue)
                }
            }
        }
    }

    fun setFillSortKey(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillSortKey(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillSortKey(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setVisibility(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setFillAntialias(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillAntialias(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillAntialias(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setFillOpacity(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setFillOpacityTransition(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillOpacityTransition = transition
        }
    }

    fun setFillColor(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setFillColorTransition(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillColorTransition = transition
        }
    }

    fun setFillOutlineColor(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillOutlineColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillOutlineColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setFillOutlineColorTransition(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillOutlineColorTransition = transition
        }
    }

    fun setFillTranslate(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillTranslate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillTranslate(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setFillTranslateTransition(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillTranslateTransition = transition
        }
    }

    fun setFillTranslateAnchor(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillTranslateAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillTranslateAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setFillPattern(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            if (styleValue.isImageStringValue) {
                layer.setProperties(PropertyFactory.fillPattern(styleValue.getImageStringValue()))
            } else {
                layer.setProperties(PropertyFactory.fillPattern(styleValue.getExpression()))
            }
        } else {
            layer.setProperties(PropertyFactory.fillPattern(styleValue.imageURI))
        }
    }

    fun setFillPatternTransition(
        layer: FillLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillPatternTransition = transition
        }
    }

    fun setLineCap(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineCap(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineCap(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setLineJoin(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineJoin(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineJoin(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setLineMiterLimit(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineMiterLimit(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineMiterLimit(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineRoundLimit(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineRoundLimit(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineRoundLimit(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineSortKey(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineSortKey(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineSortKey(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setVisibility(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setLineOpacity(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineOpacityTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineOpacityTransition = transition
        }
    }

    fun setLineColor(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setLineColorTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineColorTransition = transition
        }
    }

    fun setLineTranslate(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineTranslate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineTranslate(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setLineTranslateTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineTranslateTransition = transition
        }
    }

    fun setLineTranslateAnchor(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineTranslateAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineTranslateAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setLineWidth(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineWidth(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineWidth(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineWidthTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineWidthTransition = transition
        }
    }

    fun setLineGapWidth(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineGapWidth(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineGapWidth(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineGapWidthTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineGapWidthTransition = transition
        }
    }

    fun setLineOffset(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineOffset(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineOffset(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineOffsetTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineOffsetTransition = transition
        }
    }

    fun setLineBlur(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineBlur(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineBlur(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setLineBlurTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineBlurTransition = transition
        }
    }

    fun setLineDasharray(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineDasharray(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineDasharray(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setLineDasharrayTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.lineDasharrayTransition = transition
        }
    }

    fun setLinePattern(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            if (styleValue.isImageStringValue) {
                layer.setProperties(PropertyFactory.linePattern(styleValue.getImageStringValue()))
            } else {
                layer.setProperties(PropertyFactory.linePattern(styleValue.getExpression()))
            }
        } else {
            layer.setProperties(PropertyFactory.linePattern(styleValue.imageURI))
        }
    }

    fun setLinePatternTransition(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.linePatternTransition = transition
        }
    }

    fun setLineGradient(
        layer: LineLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.lineGradient(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.lineGradient(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setSymbolPlacement(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.symbolPlacement(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.symbolPlacement(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setSymbolSpacing(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.symbolSpacing(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.symbolSpacing(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setSymbolAvoidEdges(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.symbolAvoidEdges(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.symbolAvoidEdges(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setSymbolSortKey(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.symbolSortKey(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.symbolSortKey(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setSymbolZOrder(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.symbolZOrder(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.symbolZOrder(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setIconAllowOverlap(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconAllowOverlap(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconAllowOverlap(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setIconIgnorePlacement(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconIgnorePlacement(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconIgnorePlacement(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setIconOptional(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconOptional(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconOptional(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setIconRotationAlignment(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconRotationAlignment(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconRotationAlignment(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setIconSize(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconSize(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconSize(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setIconTextFit(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconTextFit(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconTextFit(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setIconTextFitPadding(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconTextFitPadding(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconTextFitPadding(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setIconImage(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            if (styleValue.isImageStringValue) {
                layer.setProperties(PropertyFactory.iconImage(styleValue.getImageStringValue()))
            } else {
                layer.setProperties(PropertyFactory.iconImage(styleValue.getExpression()))
            }
        } else {
            layer.setProperties(PropertyFactory.iconImage(styleValue.imageURI))
        }
    }

    fun setIconRotate(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconRotate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconRotate(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setIconPadding(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconPadding(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconPadding(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setIconKeepUpright(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconKeepUpright(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconKeepUpright(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setIconOffset(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconOffset(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconOffset(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setIconAnchor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setIconPitchAlignment(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconPitchAlignment(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconPitchAlignment(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextPitchAlignment(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textPitchAlignment(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textPitchAlignment(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextRotationAlignment(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textRotationAlignment(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textRotationAlignment(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextField(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textField(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textField(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextFont(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textFont(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textFont(styleValue.getStringArray(VALUE_KEY)))
        }
    }

    fun setTextSize(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textSize(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textSize(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextMaxWidth(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textMaxWidth(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textMaxWidth(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextLineHeight(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textLineHeight(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textLineHeight(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextLetterSpacing(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textLetterSpacing(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textLetterSpacing(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextJustify(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textJustify(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textJustify(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextRadialOffset(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textRadialOffset(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textRadialOffset(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextVariableAnchor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textVariableAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textVariableAnchor(styleValue.getStringArray(VALUE_KEY)))
        }
    }

    fun setTextAnchor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextMaxAngle(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textMaxAngle(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textMaxAngle(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextWritingMode(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textWritingMode(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textWritingMode(styleValue.getStringArray(VALUE_KEY)))
        }
    }

    fun setTextRotate(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textRotate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textRotate(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextPadding(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textPadding(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textPadding(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextKeepUpright(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textKeepUpright(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textKeepUpright(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setTextTransform(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textTransform(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textTransform(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextOffset(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textOffset(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textOffset(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setTextAllowOverlap(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textAllowOverlap(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textAllowOverlap(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setTextIgnorePlacement(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textIgnorePlacement(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textIgnorePlacement(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setTextOptional(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textOptional(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textOptional(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setVisibility(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setIconOpacity(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setIconOpacityTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.iconOpacityTransition = transition
        }
    }

    fun setIconColor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setIconColorTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.iconColorTransition = transition
        }
    }

    fun setIconHaloColor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconHaloColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconHaloColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setIconHaloColorTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.iconHaloColorTransition = transition
        }
    }

    fun setIconHaloWidth(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconHaloWidth(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconHaloWidth(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setIconHaloWidthTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.iconHaloWidthTransition = transition
        }
    }

    fun setIconHaloBlur(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconHaloBlur(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconHaloBlur(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setIconHaloBlurTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.iconHaloBlurTransition = transition
        }
    }

    fun setIconTranslate(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconTranslate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconTranslate(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setIconTranslateTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.iconTranslateTransition = transition
        }
    }

    fun setIconTranslateAnchor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.iconTranslateAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.iconTranslateAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setTextOpacity(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextOpacityTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.textOpacityTransition = transition
        }
    }

    fun setTextColor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setTextColorTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.textColorTransition = transition
        }
    }

    fun setTextHaloColor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textHaloColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textHaloColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setTextHaloColorTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.textHaloColorTransition = transition
        }
    }

    fun setTextHaloWidth(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textHaloWidth(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textHaloWidth(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextHaloWidthTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.textHaloWidthTransition = transition
        }
    }

    fun setTextHaloBlur(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textHaloBlur(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textHaloBlur(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setTextHaloBlurTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.textHaloBlurTransition = transition
        }
    }

    fun setTextTranslate(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textTranslate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textTranslate(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setTextTranslateTransition(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.textTranslateTransition = transition
        }
    }

    fun setTextTranslateAnchor(
        layer: SymbolLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.textTranslateAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.textTranslateAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setCircleSortKey(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleSortKey(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleSortKey(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setVisibility(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setCircleRadius(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleRadius(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleRadius(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setCircleRadiusTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleRadiusTransition = transition
        }
    }

    fun setCircleColor(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setCircleColorTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleColorTransition = transition
        }
    }

    fun setCircleBlur(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleBlur(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleBlur(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setCircleBlurTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleBlurTransition = transition
        }
    }

    fun setCircleOpacity(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setCircleOpacityTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleOpacityTransition = transition
        }
    }

    fun setCircleTranslate(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleTranslate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleTranslate(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setCircleTranslateTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleTranslateTransition = transition
        }
    }

    fun setCircleTranslateAnchor(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleTranslateAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleTranslateAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setCirclePitchScale(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circlePitchScale(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circlePitchScale(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setCirclePitchAlignment(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circlePitchAlignment(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circlePitchAlignment(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setCircleStrokeWidth(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleStrokeWidth(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleStrokeWidth(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setCircleStrokeWidthTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleStrokeWidthTransition = transition
        }
    }

    fun setCircleStrokeColor(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleStrokeColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleStrokeColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setCircleStrokeColorTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleStrokeColorTransition = transition
        }
    }

    fun setCircleStrokeOpacity(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.circleStrokeOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.circleStrokeOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setCircleStrokeOpacityTransition(
        layer: CircleLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.circleStrokeOpacityTransition = transition
        }
    }

    fun setVisibility(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setHeatmapRadius(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.heatmapRadius(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.heatmapRadius(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setHeatmapRadiusTransition(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.heatmapRadiusTransition = transition
        }
    }

    fun setHeatmapWeight(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.heatmapWeight(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.heatmapWeight(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setHeatmapIntensity(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.heatmapIntensity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.heatmapIntensity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setHeatmapIntensityTransition(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.heatmapIntensityTransition = transition
        }
    }

    fun setHeatmapColor(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.heatmapColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.heatmapColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setHeatmapOpacity(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.heatmapOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.heatmapOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setHeatmapOpacityTransition(
        layer: HeatmapLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.heatmapOpacityTransition = transition
        }
    }

    fun setVisibility(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setFillExtrusionOpacity(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setFillExtrusionOpacityTransition(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillExtrusionOpacityTransition = transition
        }
    }

    fun setFillExtrusionColor(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setFillExtrusionColorTransition(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillExtrusionColorTransition = transition
        }
    }

    fun setFillExtrusionTranslate(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionTranslate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionTranslate(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setFillExtrusionTranslateTransition(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillExtrusionTranslateTransition = transition
        }
    }

    fun setFillExtrusionTranslateAnchor(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionTranslateAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionTranslateAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setFillExtrusionPattern(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            if (styleValue.isImageStringValue) {
                layer.setProperties(PropertyFactory.fillExtrusionPattern(styleValue.getImageStringValue()))
            } else {
                layer.setProperties(PropertyFactory.fillExtrusionPattern(styleValue.getExpression()))
            }
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionPattern(styleValue.imageURI))
        }
    }

    fun setFillExtrusionPatternTransition(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillExtrusionPatternTransition = transition
        }
    }

    fun setFillExtrusionHeight(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionHeight(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionHeight(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setFillExtrusionHeightTransition(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillExtrusionHeightTransition = transition
        }
    }

    fun setFillExtrusionBase(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionBase(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionBase(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setFillExtrusionBaseTransition(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.fillExtrusionBaseTransition = transition
        }
    }

    fun setFillExtrusionVerticalGradient(
        layer: FillExtrusionLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.fillExtrusionVerticalGradient(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.fillExtrusionVerticalGradient(styleValue.getBoolean(VALUE_KEY)))
        }
    }

    fun setVisibility(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setRasterOpacity(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setRasterOpacityTransition(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.rasterOpacityTransition = transition
        }
    }

    fun setRasterHueRotate(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterHueRotate(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterHueRotate(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setRasterHueRotateTransition(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.rasterHueRotateTransition = transition
        }
    }

    fun setRasterBrightnessMin(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterBrightnessMin(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterBrightnessMin(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setRasterBrightnessMinTransition(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.rasterBrightnessMinTransition = transition
        }
    }

    fun setRasterBrightnessMax(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterBrightnessMax(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterBrightnessMax(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setRasterBrightnessMaxTransition(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.rasterBrightnessMaxTransition = transition
        }
    }

    fun setRasterSaturation(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterSaturation(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterSaturation(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setRasterSaturationTransition(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.rasterSaturationTransition = transition
        }
    }

    fun setRasterContrast(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterContrast(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterContrast(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setRasterContrastTransition(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.rasterContrastTransition = transition
        }
    }

    fun setRasterResampling(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterResampling(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterResampling(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setRasterFadeDuration(
        layer: RasterLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.rasterFadeDuration(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.rasterFadeDuration(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setVisibility(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setHillshadeIlluminationDirection(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.hillshadeIlluminationDirection(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.hillshadeIlluminationDirection(styleValue.getFloatArray(VALUE_KEY)))
        }
    }

    fun setHillshadeIlluminationAnchor(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.hillshadeIlluminationAnchor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.hillshadeIlluminationAnchor(styleValue.getString(VALUE_KEY)))
        }
    }

    fun setHillshadeExaggeration(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.hillshadeExaggeration(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.hillshadeExaggeration(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setHillshadeExaggerationTransition(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.hillshadeExaggerationTransition = transition
        }
    }

    fun setHillshadeShadowColor(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.hillshadeShadowColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.hillshadeShadowColor(styleValue.getStringArray(VALUE_KEY)))
        }
    }

    fun setHillshadeShadowColorTransition(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.hillshadeShadowColorTransition = transition
        }
    }

    fun setHillshadeHighlightColor(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.hillshadeHighlightColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.hillshadeHighlightColor(styleValue.getStringArray(VALUE_KEY)))
        }
    }

    fun setHillshadeHighlightColorTransition(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.hillshadeHighlightColorTransition = transition
        }
    }

    fun setHillshadeAccentColor(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.hillshadeAccentColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.hillshadeAccentColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setHillshadeAccentColorTransition(
        layer: HillshadeLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.hillshadeAccentColorTransition = transition
        }
    }

    fun setVisibility(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        layer.setProperties(PropertyFactory.visibility(styleValue.getString(VALUE_KEY)))
    }

    fun setBackgroundColor(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.backgroundColor(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.backgroundColor(styleValue.getInt(VALUE_KEY)))
        }
    }

    fun setBackgroundColorTransition(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.backgroundColorTransition = transition
        }
    }

    fun setBackgroundPattern(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            if (styleValue.isImageStringValue) {
                layer.setProperties(PropertyFactory.backgroundPattern(styleValue.getImageStringValue()))
            } else {
                layer.setProperties(PropertyFactory.backgroundPattern(styleValue.getExpression()))
            }
        } else {
            layer.setProperties(PropertyFactory.backgroundPattern(styleValue.imageURI))
        }
    }

    fun setBackgroundPatternTransition(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.backgroundPatternTransition = transition
        }
    }

    fun setBackgroundOpacity(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        if (styleValue.isExpression()) {
            layer.setProperties(PropertyFactory.backgroundOpacity(styleValue.getExpression()))
        } else {
            layer.setProperties(PropertyFactory.backgroundOpacity(styleValue.getFloat(VALUE_KEY)))
        }
    }

    fun setBackgroundOpacityTransition(
        layer: BackgroundLayer,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.backgroundOpacityTransition = transition
        }
    }

    fun setAnchor(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        layer.anchor = styleValue.getString(VALUE_KEY)
    }

    fun setPosition(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        val values = styleValue.getFloatArray(VALUE_KEY)
        layer.position = Position.fromPosition(values[0]!!, values[1]!!, values[2]!!)
    }

    fun setPositionTransition(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.positionTransition = transition
        }
    }

    fun setColor(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        layer.setColor(styleValue.getInt(VALUE_KEY))
    }

    fun setColorTransition(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.colorTransition = transition
        }
    }

    fun setIntensity(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        layer.intensity = styleValue.getFloat(VALUE_KEY)
    }

    fun setIntensityTransition(
        layer: Light,
        styleValue: MLRNStyleValue,
    ) {
        val transition = styleValue.transition
        if (transition != null) {
            layer.intensityTransition = transition
        }
    }
}
