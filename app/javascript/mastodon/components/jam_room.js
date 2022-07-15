import React from 'react';
import Avatar from 'mastodon/components/avatar';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { useJam, use } from 'jam-core-react';


export default class JamRoom extends React.PureComponent {

  static propTypes = {
    speakers: ImmutablePropTypes.list,
  };


  static defaultProps = {};

  state = {
    inRoom: false,
  };


  handleEnterRoom = (e) => {
    e.preventDefault();
    console.log('Entering room');

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const inRoom = true;
      this.setState({ inRoom });
    }
  }

  renderJamRoom() {

  }

  renderJamLobby(speakers) {
    return (<div className={'jam-room-outside'}>
      <button onClick={this.enterRoom}>Enter room</button>
      <ul>
        {speakers.map((speaker) => (

          <li key={speaker.get('acct')}>
            <div><Avatar account={speaker} size={24} /></div>
          </li>
        ))}
      </ul>
    </div>);
  }

  render() {
    let { inRoom } = this.state;
    let { speakers } = this.props;

    return inRoom ? (<Room />) : this.renderJamLobby(speakers);


  };


}

function Room() {
  let [state, api] = useJam();
  let { enterRoom } = api;
  let [myIdentity, roomId] = use(state, ['myIdentity', 'roomId']);
  return (<div>
    <h3>Test</h3>
  </div>);
}

