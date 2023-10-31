from .models import Users,Personnel
from .serializer import UsersSerializer

def getUsersForAdmin(u,pov_):
	final = []
	pers =  Personnel.objects.filter(user = u)
	for per in pers:
		pov = per.pov
		pers2 = Personnel.objects.filter(pov = pov)
		for per2 in pers2:
			user = per2.user
			if user.role not in ['super']:
				udata = UsersSerializer(user).data
				if pov.id == pov_.id:
					udata['linked'] = True
				else:
					udata['linked'] = False
				final.append(udata)
	return final

