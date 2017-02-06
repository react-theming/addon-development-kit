import { addonComposer } from '../../src';
import AddonDecor from '../components/addonDecorator';

function storeHandler(storeData, props, addonApi) {
    return {
        label: storeData.label,
        index: storeData.index,
        onClick: addonApi.setLabel,
        voting: props.voting,
        story: props.story,
    };
}
export default addonComposer(storeHandler, AddonDecor);
