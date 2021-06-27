import Vue from 'vue';
import  { LMap, LTileLayer, LMarker, LPopup, LControl, LGeoJson, LFeatureGroup, LCircle, LIcon, LIconDefault, LRectangle, LControlAttribution, LControlLayers, LControlZoom, LTooltip } from 'vue2-leaflet';
import { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
Vue.component('LMap', LMap);
Vue.component('LTileLayer', LTileLayer);
Vue.component('LMarker', LMarker);
Vue.component('LPopup', LPopup);
Vue.component('LControl', LControl);
Vue.component('LGeoJson', LGeoJson);
Vue.component('LFeatureGroup', LFeatureGroup);
Vue.component('LCircle', LCircle);
Vue.component('LIcon', LIcon);
Vue.component('LIconDefault', LIconDefault);
Vue.component('LRectangle', LRectangle);
Vue.component('LControlAttribution', LControlAttribution);
Vue.component('LControlLayers', LControlLayers);
Vue.component('LControlZoom', LControlZoom);
Vue.component('LGeoJson', LGeoJson);
Vue.component('LTooltip', LTooltip);
