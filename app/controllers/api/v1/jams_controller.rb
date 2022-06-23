# frozen_string_literal: true

class Api::V1::JamsController < Api::BaseController
  include Authorization

  before_action -> { authorize_if_got_token! :read, :'read:statuses' }
  before_action :require_user!, except:  [:show]
  before_action :set_jam, only:          [:show]

  def show
    @jam = cache_collection([@jam], Jam).first
    render json: @jam, serializer: REST::JamSerializer
  end

  private

  def set_jam
    @jam = Jam.find(params[:id])
    authorize @jam.status, :show?
  rescue Mastodon::NotPermittedError
    not_found
  end

end
