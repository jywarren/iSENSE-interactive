var React = require('react');

var DatasetList = React.createClass({
  render: function() {
  	// need to go through the passed in datasets array
  	// only include datasets that have the same project and classPeriod
  	var datasetRows = [];
  	this.props.datasets.forEach(function (dataset) {
  		if(dataset.project === this.props.project &&
  		   dataset.classPeriod === this.props.classPeriod) {
  			datasetRows.push(
  				<DatasetListItem dataset={dataset}/>);
  		}
  	}.bind(this));

    return (
      <div>
        <ul>
          {datasetRows}
        </ul>
      </div>
    )
  }
});

var DatasetListItem = React.createClass({
  render: function() {
  	return (
  		<div>
  		  Team: {this.props.dataset.team.name},{" "}
  		  Data: {JSON.stringify(this.props.dataset.data)},{" "}
  		  Status: {this.props.dataset.status}
  		</div>
  		);
  }
});

module.exports = DatasetList;