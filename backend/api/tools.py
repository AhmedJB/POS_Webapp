import hashlib

def encrypt_str(s):
	return hashlib.sha256(s.encode()).hexdigest()


	
