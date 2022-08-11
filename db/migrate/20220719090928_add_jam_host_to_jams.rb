class AddJamHostToJams < ActiveRecord::Migration[6.1]
  def change
    add_column :jams, :jam_host, :string
  end
end
