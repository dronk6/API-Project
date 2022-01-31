// dependencies / things imported
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line no-unused-vars
import { WikipediaQuery } from '@lrnwebcomponents/wikipedia-query/wikipedia-query.js';
import { UserIP } from './UserIP.js';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.long = null;
    this.lat = null;
    this.city = null;
    this.state = null;
  }

  static get properties() {
    return {
      lat: { type: Number, reflect: true },
      long: { type: Number, reflect: true },
      city: { type: String },
      state: { type: String },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.lat = data.latitude;
        this.long = data.longitude;
        this.city = data.city;
        this.state = data.region_name;
        console.log(`${this.lat}, ${this.long}, ${this.city}, ${this.state}`);
        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return html`
      <iframe title="Where you are" src="${url}"></iframe>
      <br />
      <a href="https://www.google.com/maps/@${this.lat},${this.long},14z"
        >View your location on Google Maps</a
      >
      <br />
      <wikipedia-query search="${this.city}, ${this.state}"></wikipedia-query>
      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.state}"></wikipedia-query>
    `;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
