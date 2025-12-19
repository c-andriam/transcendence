NAME = ft_transcendence
FILE = ./docker-compose.yml
DC = podman compose -f $(FILE) --project-name $(NAME)

all: up

up:
	$(DC) up --build -d

start:
	$(DC) start

stop:
	$(DC) stop

down:
	$(DC) down --remove-orphans -v

clean: stop
	$(DC) rm -f

fclean: clean down

re: clean all

rebuild: fclean all

status:
	$(DC) ps

logs:
	$(DC) logs -f

nginx:
	$(DC) logs nginx

.PHONY: all up status start down clean fclean re rebuild logs nginx stop