var ReagentViewField = require('./reagent-view-field');
var fieldTypes = require('../../field-types');

function ReagentViewRow(props) {
    var rowProps = getDefaultReagentViewRow();

    if (props && _.isObject(props)) {
        // Assign known properties from given obj
        // This will mutate rowProps object
        setRowProperties(rowProps, props);
    }

    _.defaults(this, rowProps);

    return this;
}

function setRowProperties(defaultProps, customProps) {
    // Assign known custom properties to default object
    _.forEach(customProps, function(value, key) {
        if (fieldTypes.isMolWeight(key)) {
            defaultProps[key].value = value.value;
            defaultProps[key].originalValue = value.value;
            defaultProps[key].entered = value.entered;
        } else if (fieldTypes.isReagentField(key)) {
            defaultProps[key].value = value.value;
            defaultProps[key].entered = value.entered;
        } else if (fieldTypes.isEq(key) || fieldTypes.isStoicPurity(key)) {
            defaultProps[key].value = value.value;
            defaultProps[key].prevValue = value.prevValue ? value.prevValue : value.value;
            defaultProps[key].entered = value.entered;
        } else if (fieldTypes.isRxnRole(key)) {
            defaultProps[key].name = value.name;

            if (_.has(customProps, fieldTypes.prevRxnRole)) {
                defaultProps.prevRxnRole.name = customProps.prevRxnRole.name;
            } else {
                defaultProps.prevRxnRole.name = defaultProps[key].name;
            }
        }
    });

    // Replace default values and add missing from given customProps obj
    _.assignWith(defaultProps, customProps, function(defaultValue, valueFromJson) {
        return _.isNil(defaultValue)
            ? valueFromJson
            : defaultValue;
    });
}

ReagentViewRow.prototype = {
    changesQueue: [],
    clear: clear,
    constructor: ReagentViewRow
};

ReagentViewRow.getDefaultReagentViewRow = getDefaultReagentViewRow;


function clear() {
    _.assign(this, getDefaultReagentViewRow());
}

function getDefaultReagentViewRow() {
    return {
        compoundId: null,
        chemicalName: null,
        fullNbkBatch: null,
        molWeight: {value: 0, originalValue: 0, entered: false},
        weight: new ReagentViewField(0, 'mg'),
        volume: new ReagentViewField(0, 'mL'),
        mol: new ReagentViewField(0, 'mmol'),
        eq: {value: 1, prevValue: 1, entered: false, readonly: false},
        limiting: false,
        rxnRole: {name: 'REACTANT'},
        prevRxnRole: {name: 'REACTANT'},
        density: new ReagentViewField(0, 'g/mL'),
        molarity: new ReagentViewField(0, 'M'),
        // TODO: rename to purity
        stoicPurity: {value: 100, prevValue: 100, entered: false, readonly: false},
        formula: null,
        saltCode: {name: '00 - Parent Structure', value: '0', regValue: '00', weight: 0, readonly: false},
        saltEq: {value: 0},
        loadFactor: new ReagentViewField(1, 'mmol/g'),
        hazardComments: null,
        comments: null
    };
}

module.exports = ReagentViewRow;
