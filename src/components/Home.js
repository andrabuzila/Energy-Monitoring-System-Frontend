import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div className="main-dashboard">
        <h1>Energy Utility Platform</h1>
        <p>Enabling real time monitoring for smart devices.</p>
        <p>This assingment represents the first module of the distributed software system "Integrated Energy Monitoring Platform for Households" that represents the final project for the Distributed Systems course.</p>
        <p>You can access our page for more information: dsrl.eu/courses/sd</p>
      </div>
    );
  }
}
