import { addonComposer } from '../../src';
import Voting from '../components/voting';

function storeHandler(storeData, props, addonApi) {
    return {
        index: storeData.index,
        onVote: addonApi.incIndex,
    };
}
export default addonComposer(storeHandler, Voting);
