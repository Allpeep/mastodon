import React, {useEffect} from 'react';
import Avatar from 'mastodon/components/avatar';
import { debounce } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { importDefaultIdentity } from 'jam-core';


export default class Jam extends React.PureComponent {

  static propTypes = {
    jam: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
  };

  static defaultProps = {
  };

  state = {
    inRoom: false,
    isIdentitySet: false,
  };

  // componentWillReceiveProps (nextProps) {
  //   nextProps;
  // }


  componentDidMount () {
    window.addEventListener('resize', this.handleResize, { passive: true });
    const { jam, account } = this.props;
    useEffect(async () => {
      await importDefaultIdentity({
        info: {
          name: account.get('display_name') || account.get('username'),
          avatar: account.get('avatar_static'),
        },
        seed: jam.get('jam_seed'),
      });
      this.setState({ isIdentitySet: true });
    });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  _setDimensions () {
    const width = this.node.offsetWidth;

    this.setState({ width });
  }

  enterRoom = (e) => {
    e.preventDefault();
    console.log('Entering room');

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      const inRoom = true;
      this.setState({ inRoom });
    }
  }


  handleResize = debounce(() => {
    if (this.node) {
      this._setDimensions();
    }
  }, 250, {
    trailing: true,
  });


  setRef = c => {
    this.node = c;

    if (this.node) {
      this._setDimensions();
    }
  }

  renderJamFrame = (jam, account) => {

    const jamConfig = {
      domain: 'beta.jam.systems',
      development: true,
      sfu: true,
    };

    return (<iframe
      title={'Jam'}
      className={'jam__iframe'}
      allow='microphone;*'
      src={`${jam.get('server_url')}/${jam.get('room_id')}?debug=yes#${jamHash}`}
    />);

  }

  render () {



    const { jam, account } = this.props;

    const speakers = jam.get('speakers');
    const inRoom = this.state.inRoom;
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    console.log(inRoom);

    console.log(speakers.map((s) => s));

    return (
      <div>
        { inRoom ? this.renderJamFrame(jam, account) : (<button  onClick={this.enterRoom}>Enter room</button>) }
        { !inRoom && <div className={'jam-room-outside'}>
          <ul>
            {speakers.map((speaker) => (

              <li key={speaker.get('acct')}>
                <div><Avatar account={speaker} size={24} /></div>
              </li>
            ))}
          </ul>
        </div>}
      </div>
    );
  }

}
