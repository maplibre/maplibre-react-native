import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Link} from 'expo-router';
import {useExpoRouter} from 'expo-router/src/global-state/router-store';

function extractRoutes(jsonArray) {
  const result = {};

  function recursiveExtract(node) {
    if (node.children && node.children.length > 0) {
      node.children.forEach(recursiveExtract);
    }

    if (node.route && node.contextKey) {
      if (['(examples)', 'index'].includes(node.route)) return;
      const parts = node.route.split('/');
      if (!result[parts[0]]) {
        result[parts[0]] = [];
      }
      if (parts[1]) {
        result[parts[0]].push(node.route);
      } else {
        result[parts[0]].push([]);
      }
    }
  }

  jsonArray.forEach(recursiveExtract);

  return result;
}

const TreeView = ({data}) => {
  const renderChildren = ({children}) => {
    return (
      <View>
        {children.map(child => (
          <View key={child} style={{paddingLeft: 16}}>
            <Link href={child}>{String(child).split('/').pop()}</Link>
          </View>
        ))}
      </View>
    );
  };

  const renderItem = ({item: [route, children]}) => {
    return (
      <View key={route} style={{width: '100%'}}>
        <TouchableOpacity>
          <Text>{route}</Text>
        </TouchableOpacity>
        {children && children.length > 0 && renderChildren({children})}
      </View>
    );
  };

  return (
    <FlatList
      style={{width: '100%'}}
      data={data}
      keyExtractor={item => item}
      renderItem={renderItem}
    />
  );
};

export const FileSystemView = () => {
  const routes = useExpoRouter().getSortedRoutes();
  return <TreeView data={Object.entries(extractRoutes(routes))} />;
};

export const Example = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'start',
        justifyContent: 'center',
        padding: 16,
        width: '100%',
        marginTop: 64,
        marginBottom: 64,
      }}>
      <Text style={{fontWeight: 'bold', paddingBottom: 16}}>
        maplibre/maplibre-react-native example
      </Text>
      <FileSystemView />
      <Link href="_sitemap">Sitemap</Link>
    </View>
  );
};
export default Example;
