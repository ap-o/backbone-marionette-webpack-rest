import BaseCollection from './Base';
import TodoModel from 'models/Todo';

export default BaseCollection.extend({
    model: TodoModel,
    endpoint: "todo/list",
});
