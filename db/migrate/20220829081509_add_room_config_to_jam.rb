class AddRoomConfigToJam < ActiveRecord::Migration[6.1]
  def change
    add_column :jams, :room_config, :jsonb
  end
end
