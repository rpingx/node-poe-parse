import axios from 'axios';

export default {
    getList: (success) => {
        axios.get(DATAAPIURL + "getList").then((res)=> {
            success(res.data);
        });
    }
};