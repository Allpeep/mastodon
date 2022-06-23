class CreateJams < ActiveRecord::Migration[6.1]
  def change
    create_table :jams do |t|
      t.string "room_id", null: false
      t.bigint "status_id"

      t.timestamps
    end

    create_table "accounts_jams", id: false do |t|
      t.bigint "account_id", null: false
      t.bigint "jam_id", null: false
      t.index ["account_id", "jam_id"], name: "index_accounts_jams_on_account_id_and_jam_id"
      t.index ["jam_id", "account_id"], name: "index_accounts_jams_on_jam_id_and_account_id", unique: true
    end

    add_column :statuses, :jam_id, :bigint
    #add_index :statuses, [:jam_id], name: :index_statuses_on_jam_id

  end
end
