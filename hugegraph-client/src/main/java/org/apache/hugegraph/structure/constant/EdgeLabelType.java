/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to You under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

package org.apache.hugegraph.structure.constant;

public enum EdgeLabelType {

    NORMAL(0, "NORMAL"),

    PARENT(1, "PARENT"),

    SUB(2, "SUB");

    private final byte code;
    private final String name;

    EdgeLabelType(int code, String name) {
        assert code < 256;
        this.code = (byte) code;
        this.name = name;
    }

    public boolean parent() {
        return this == PARENT;
    }

    public boolean sub() {
        return this == SUB;
    }

    public boolean normal() {
        return this == NORMAL;
    }

    public byte code() {
        return this.code;
    }

    public String string() {
        return this.name;
    }
}