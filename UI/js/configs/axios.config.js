import axios from "axios";

export default (() => {
    axios.defaults.baseURL = DATAAPIURL;
})();