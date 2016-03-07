import BaseCollection from './Base';
import FolderModel from 'models/Folder';

export default BaseCollection.extend({
    model: FolderModel,
    endpoint: "folder/list"
});
