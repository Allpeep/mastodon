# initialize an AllPeep environment

Rails.application.configure do
    config.x.hide_nav_item = {
    :home => ENV['HIDE_NAV_ITEM_HOME'].presence && ENV['HIDE_NAV_ITEM_HOME'].to_s.downcase == 'true',
    :notifications => ENV['HIDE_NAV_ITEM_NOTIFICATIONS'].presence && ENV['HIDE_NAV_ITEM_NOTIFICATIONS'].to_s == 'true',
    :explore => ENV['HIDE_NAV_ITEM_EXPLORE'].presence && ENV['HIDE_NAV_ITEM_EXPLORE'].to_s == 'true',
    :search => ENV['HIDE_NAV_ITEM_SEARCH'].presence && ENV['HIDE_NAV_ITEM_SEARCH'].to_s == 'true',
    :local => ENV['HIDE_NAV_ITEM_LOCAL'].presence && ENV['HIDE_NAV_ITEM_LOCAL'].to_s == 'true',
    :federated => ENV['HIDE_NAV_ITEM_FEDERATED'].presence && ENV['HIDE_NAV_ITEM_FEDERATED'].to_s == 'true',
    :direct => ENV['HIDE_NAV_ITEM_DIRECT'].presence && ENV['HIDE_NAV_ITEM_DIRECT'].to_s == 'true',
    :favourites => ENV['HIDE_NAV_ITEM_FAVOURITES'].presence && ENV['HIDE_NAV_ITEM_FAVOURITES'].to_s == 'true',
    :bookmarks => ENV['HIDE_NAV_ITEM_BOOKMARKS'].presence && ENV['HIDE_NAV_ITEM_BOOKMARKS'].to_s == 'true',
    :lists => ENV['HIDE_NAV_ITEM_LISTS'].presence && ENV['HIDE_NAV_ITEM_LISTS'].to_s == 'true',
    :preferences => ENV['HIDE_NAV_ITEM_PREFERENCES'].presence && ENV['HIDE_NAV_ITEM_PREFERENCES'].to_s == 'true',
    :about => ENV['HIDE_NAV_ITEM_ABOUT'].presence && ENV['HIDE_NAV_ITEM_ABOUT'].to_s == 'true',
  }

  config.x.allpeep_features {
    :private_community => ENV['LIMITED_FEDERATION_MODE'].presence && ENV['LIMITED_FEDERATION_MODE'] == 'true',
  }

end
