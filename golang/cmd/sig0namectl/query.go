package main

import (
	"fmt"

	"github.com/NetworkCommons/sig0namectl/sig0"
	"github.com/davecgh/go-spew/spew"
	"github.com/urfave/cli/v2"
)

var queryCmd = &cli.Command{
	Name:      "query",
	Usage:     "query <name>",
	Aliases:   []string{"q"},
	UsageText: "See flags for usage",
	Action:    queryAction,
}

func queryAction(cCtx *cli.Context) error {
	name := cCtx.Args().First()
	fmt.Printf("Q:(TXT):%v\n", name)

	q, err := sig0.QueryA(name)
	if err != nil {
		return err
	}

	server := cCtx.String("server")
	answer, err := sig0.SendDOHQuery(server, q)
	if err != nil {
		return err
	}

	spew.Dump(answer)
	return nil
}