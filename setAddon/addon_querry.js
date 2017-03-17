import React from 'react';

const querryManager = {
    qIndex: 0,
    getInd() {
        return querryManager.qIndex++;
    },
}

const addons = {
   querry() {
       this.add('querry addon', () => (
         <div>
           It is a test querry addon {`#${querryManager.getInd()}`}
         </div>
       ))
   }
}

export default addons;
