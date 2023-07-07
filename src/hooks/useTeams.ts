import { useEffect, useState } from "react";
import { Team } from "../types";

import { socket } from "../socket";

export default function useTeams(diffTimeout: number) {
    const [teams, setTeams] = useState<Team[]>([]);

    const [diff, setDiff] = useState<{ [key: number]: { amount: number, at: Date } }>({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/api`).then((resp) => resp.json()).then((v) => {
            setTeams(v);
        });
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('team_updated', (team: Team) => {
            const oldTeam = teams.find((v) => v.id === team.id);
            if (oldTeam) {
                const newDiff = {
                    ...diff,
                    [team.id]: {
                        amount: team.money - oldTeam.money,
                        at: new Date(),
                    }
                };

                setDiff(Object.fromEntries(
                    Object.entries(newDiff).filter(([k, v]) => (Date.now() - v.at.getTime()) < diffTimeout)
                ));
            }

            setTeams(teams.map((v) => v.id === team.id ? team : v));
        });

        return () => {
            socket.off('connect');
            socket.off('team_updated');
        }
    }, [teams, diff, diffTimeout]);

    const debugUpdate = () => {
        const team = Math.floor(Math.random() * teams.length);
        const moneyDiff = Math.floor((Math.random() * 1000));

        setTeams(teams.map((v, i) => i === team ? { ...v, money: v.money + moneyDiff } : v));
    };

    return { teams, debugUpdate, diff };
}
