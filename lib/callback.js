/**
 * Created by Sandro Kock <sandro.kock@gmail.com> on 09.03.16.
 */

function Callback(){
    if(!(this instanceof Callback)) {
        return new Callback();
    }
    this.callbacks = {};
}

Callback.prototype._generateId = function(){
    return Math.random().toString(16).substr(2, 13).toUpperCase();
};

Callback.prototype.addCallback = function(callback){
    var id = this._generateId();
    this.callbacks[id] = callback;
    return id;
};

Callback.prototype.onceCallback = function(id, err, packet){
    if (this.callbacks[id]){
        this.callbacks[id](err, packet);
        delete this.callbacks[id];
        return true;
    }
    return false;
};


module.exports = Callback;