package org.maplibre.reactnative.utils;

import org.maplibre.android.style.expressions.Expression;

public class ClusterPropertyEntry {
    public Expression operator;
    public Expression mapping;

    public ClusterPropertyEntry(Expression _operator, Expression _mapping) {
        operator = _operator;
        mapping = _mapping;
    }
}