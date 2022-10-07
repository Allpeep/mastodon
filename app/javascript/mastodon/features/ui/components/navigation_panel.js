import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'mastodon/components/icon';
import { showTrends } from 'mastodon/initial_state';
import NotificationsCounterIcon from './notifications_counter_icon';
import FollowRequestsNavLink from './follow_requests_nav_link';
import ListPanel from './list_panel';
import TrendsContainer from 'mastodon/features/getting_started/containers/trends_container';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  hide_nav_item: state.getIn(['meta', 'hide_nav_item']),
});

const NavigationPanel = ({ hide_nav_item }) => {
  return (
    <div className='navigation-panel'>
      {!hide_nav_item.get('home') &&
        <NavLink className='column-link column-link--transparent' to='/home' data-preview-title-id='column.home' data-preview-icon='home' ><Icon className='column-link__icon' id='home' fixedWidth /><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></NavLink>
      }
      {!hide_nav_item.get('notifications') &&
        <NavLink className='column-link column-link--transparent' to='/notifications' data-preview-title-id='column.notifications' data-preview-icon='bell' ><NotificationsCounterIcon className='column-link__icon' /><FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' /></NavLink>
      }
      <FollowRequestsNavLink />
      {!hide_nav_item.get('explore') &&
        <NavLink className='column-link column-link--transparent' to='/explore' data-preview-title-id='explore.title' data-preview-icon='hashtag'><Icon className='column-link__icon' id='hashtag' fixedWidth /><FormattedMessage id='explore.title' defaultMessage='Explore' /></NavLink>
      }
      {!hide_nav_item.get('home') &&
        <NavLink className='column-link column-link--transparent' to='/public/local' data-preview-title-id='column.community' data-preview-icon='users' ><Icon className='column-link__icon' id='users' fixedWidth /><FormattedMessage id='tabs_bar.local_timeline' defaultMessage='Local' /></NavLink>
      }
      {!hide_nav_item.get('federated') &&
        <NavLink className='column-link column-link--transparent' exact to='/public' data-preview-title-id='column.public' data-preview-icon='globe' ><Icon className='column-link__icon' id='globe' fixedWidth /><FormattedMessage id='tabs_bar.federated_timeline' defaultMessage='Federated' /></NavLink>
      }
      {!hide_nav_item.get('conversations') &&
        <NavLink className='column-link column-link--transparent' to='/conversations'><Icon className='column-link__icon' id='at' fixedWidth /><FormattedMessage id='navigation_bar.direct' defaultMessage='Direct messages' /></NavLink>
      }
      {!hide_nav_item.get('favourites') &&
        <NavLink className='column-link column-link--transparent' to='/favourites'><Icon className='column-link__icon' id='star' fixedWidth /><FormattedMessage id='navigation_bar.favourites' defaultMessage='Favourites' /></NavLink>
      }
      {!hide_nav_item.get('bookmarks') &&
        <NavLink className='column-link column-link--transparent' to='/bookmarks'><Icon className='column-link__icon' id='bookmark' fixedWidth /><FormattedMessage id='navigation_bar.bookmarks' defaultMessage='Bookmarks' /></NavLink>
      }
      {!hide_nav_item.get('lists') &&
        <NavLink className='column-link column-link--transparent' to='/lists'><Icon className='column-link__icon' id='list-ul' fixedWidth /><FormattedMessage id='navigation_bar.lists' defaultMessage='Lists' /></NavLink>
      }
      <ListPanel />

      <hr />

      {!hide_nav_item.get('preferences') &&
        <a className='column-link column-link--transparent' href='/settings/preferences'><Icon className='column-link__icon' id='cog' fixedWidth /><FormattedMessage id='navigation_bar.preferences' defaultMessage='Preferences' /></a>
      }
      {!hide_nav_item.get('relationships') &&
        <a className='column-link column-link--transparent' href='/relationships'><Icon className='column-link__icon' id='users' fixedWidth /><FormattedMessage id='navigation_bar.follows_and_followers' defaultMessage='Follows and followers' /></a>
      }

      {showTrends && <div className='flex-spacer' />}
      {showTrends && <TrendsContainer />}
    </div>
  )
};

export default withRouter(connect(mapStateToProps)(NavigationPanel));


