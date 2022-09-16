class AddScheduleToJam < ActiveRecord::Migration[6.1]
  def change
    add_column :jams, :schedule, :datetime
  end
end
