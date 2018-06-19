import axios from 'axios';

const getData = (url, params) => {
    console.log(url);
    return axios({
        url: url,
        method: 'GET',
        params: params
    }).then(function (response) {
        return response.data;
    });
};

export default {
    getItem: (id) => getData("getItem", {"id": id}),
    getList: () => getData("getList"),
    addRecipe: (recipe) => getData("addRecipe", {"recipe": JSON.stringify(recipe)}),
    reload: () => getData("reload")
}