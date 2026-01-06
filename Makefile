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

status:
	$(DC) ps

down:
	$(DC) down --remove-orphans -v

clean: stop
	$(DC) rm -f

fclean: clean down
	podman volume prune -f

re: clean all

rebuild: fclean all

.PHONY: all up start stop status down clean fclean re rebuild
