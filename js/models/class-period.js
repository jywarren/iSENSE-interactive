	// {
	// 	"uri": "https://itsi.portal.concord.org/classes/1",
	// 	"name": "Period 1",
	// 	"state": "MA",
	// 	"teachers": [
	// 	   {
	// 	   	  "id": "https://itsi.portal.concord.org/users/1",
	// 	   	  "first_name": "Scott",
	// 	   	  "last_name": "Cytacki"
	// 	   	}
	// 	],
	// 	"computed label_needs to be less than 40 chars": "ma-cytacki-period1"
	// },


var ClassPeriod = function(data){
  this.uri = data.uri;
  this.name = data.name;
  this.state = data.state;
  this.teachers = data.teachers;
  this.teacherName = data.teachers[0].last_name;
};

ClassPeriod.prototype.isenseLabel = function() {
  // this label can only be 40 characters so:
  // 2 separators between state and teacher and teacher and class
  // 2 State
  // 18 teacher
  // 18 class example "Science 101 Period 1" will be turned into "Science 101 Period"
  var teacherLastName = this.teacherName,
      className = this.name,
      label = "";

  if ((teacherLastName.length + className.length) > 36) {
    if(teacherLastName.length > 18 && className.length > 18) {
      // they are both long shorten them both to 18
      teacherLastName = shortenString(teacherLastName, 18);
      className = shortenString(className, 18);
    } else {
      if (teacherLastName.length > className.length) {
        teacherLastName = shortenString(teacherLastName, 36-className.length);
      } else {
        className = shortenString(className, 36-teacherLastName.length);
      }
    }
  }
  label = this.state + '-' + teacherLastName + '-' + className;
  return label.toLowerCase();
};

ClassPeriod.prototype.contributorKey = function() {
  var key = this.uri;

  // need to shorten the key it can only be 40 chars
  // strip off http[s]://
  // strip 'concord.org'
  key = key.replace('.concord.org', '');
  key = key.replace('http://', '');
  key = key.replace('https://', '');
  return key;
};

ClassPeriod.prototype.registerKeys = function(callback) {
  var oReq = new XMLHttpRequest(),
      self = this;

  oReq.onload = function () {
    // We should save which projects the key was added too
    callback(null);
  };

  oReq.onerror = function (error) {
    callback(error);
  }

  // oReq.open("POST", "http://localhost:9292/", true);
  // oReq.open("POST", "https://isense-key-maker.herokuapp.com/isense-keys");
  oReq.open("POST", "https://waterscience-isense.concord.org/isense-keys");
  oReq.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  // this might take a while
  oReq.send(JSON.stringify({
    name: this.isenseLabel(),
    key:  this.contributorKey()
  }));
}

ClassPeriod.prototype.summaryText = function() {
  return this.name + ", " +
         this.teacherName + ", " +
         this.state;
};

ClassPeriod.prototype.serialize = function(manager) {
  return {
    uri: this.uri,
    name: this.name,
    state: this.state,
    teachers: this.teachers
  };
};

ClassPeriod.deserialize = function(manager, data) {
  return new ClassPeriod(data);
};

module.exports = ClassPeriod;
