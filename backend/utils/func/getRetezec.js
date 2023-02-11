module.exports = function getRetezec(obj) {
    function getAllValuesFromObject(objt) {
        let values = []
        for (const key in objt) {
            if (objt.hasOwnProperty(key)) {
                const value = objt[key]
                if (typeof value === 'object') {
                    values = values.concat(getAllValuesFromObject(value))
                } else {
                    values.push(value)
                }
            }
        }
        return values;
    }
    let values = getAllValuesFromObject(obj)
    let stringValues = ''
    values.map(value => stringValues += (value + '|'))
    return stringValues.slice(0, -1)
}