module.exports = {
    lengthOfArray(obj) {
        if (Array.isArray(obj)) {
            return obj.length
        }

        if (!Array.isArray(obj) && isJSONObject(obj)) {
            return Object.values(obj).length
        }

        return 0
    },
    isJSONObject(obj) {
        try {
            JSON.parse(obj);
            return true;
        } catch (e) {
            return false;
        }
    }
};
