# frozen_string_literal: true

module SsrHelper

  MESSAGE_VALIDITY_SECONDS = 300
  SSR_VERSION = 0
  KEY_TYPE = 'ed25519'

  def signData(signing_key, data)
    certified_data = Base64.encode64(data.to_json)
    expiration = Time.now.to_i + MESSAGE_VALIDITY_SECONDS

    bytes_to_sign = [version_bytes, expiration_bytes(expiration), key_type_bytes, Base64.decode64(certified_data).bytes].flatten

    signatures = [create_signature(signing_key, bytes_to_sign)]

    {
      Version: SSR_VERSION,
      Expiration: expiration,
      KeyType: KEY_TYPE,
      Certified: certified_data,
      Signatures: signatures
    }
  end

  private

  def create_signature(signing_key, bytes_to_sign)
    {
      Identity: Base64.encode64(signing_key.verify_key),
      Payload: Base64.encode64(signing_key.sign(bytes_to_sign.pack('C*')))
    }
  end

  def expiration_bytes(expiration)
    (0..7).map{|offset| (expiration >> (8 * offset)) & 0xff}
  end

  def version_bytes
    (0..3).map{|offset| (SSR_VERSION >> (8 * offset)) & 0xff}
  end

  def key_type_bytes
    KEY_TYPE.bytes
  end
end
