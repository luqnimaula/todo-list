import Config from '@config/Config';
import Mustache from 'mustache';

const {BASE_API} = Config;

const RouteAccess = {
    getApi: function(name, object) {
        if (this.hasOwnProperty(name)) return Mustache.render(this[name], object);
        return null;
    },
    TODO_ACTIVITY: BASE_API + '/activity-groups',
    TODO_ACTIVITY_ID: BASE_API + '/activity-groups/{{id}}',
    TODO_ACTIVITY_ITEM: BASE_API + '/todo-items',
    TODO_ACTIVITY_ITEM_ID: BASE_API + '/todo-items/{{id}}',
};

export default RouteAccess;
