'use strict'

module.exports = {
    {% for compName, compGroup in tokens %}
    {% for subName, subGroup in compGroup %}
    {% for obj in subGroup %}
    "{{obj.name}}": {{obj.value | dump | safe}},
    {% endfor %}
    {% endfor %}
    {% endfor %}
};
